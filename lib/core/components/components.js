import { apply } from '../../utils/dom/node/apply';
import { breakpointEvent } from '../../services/breakpoints';
import { fastDom } from './fastdom';
import { findAll } from '../../utils/dom/node/find';
import { isElement } from '../../utils/dom/misc/isElement';
import { on } from '../../utils/dom/event/on';
import { parents } from '../../utils/dom/node/parents';
import { toElement } from '../../utils/dom/misc/toElement';
import { ucFirst } from '../../utils/lang/string/ucFirst';
import { isString } from '../../utils/lang/string';
import { noop } from '../../utils/lang/function';
import { once } from '../../utils/dom/event';
const activeScrollEventOrigins = [];
const components = {};
let hasActiveScrollEvent = null;
let isInitialized = false;
let unbindScrollEvent = null;
let rootCache = null;
function addGlobalEvents() {
    on(window, 'load resize', emitThrottled('resize'));
    on(window, breakpointEvent, emitThrottled('breakpoint'));
    setActiveScrollEvent(activeScrollEventOrigins.length > 0);
}
function applyAttribute({ target }) {
    if (!isElement(target)) {
        return false;
    }
    const names = target.__tynyViews ? Object.keys(target.__tynyViews) : [];
    let hasChanged = false;
    for (let index = 0; index < target.classList.length; index++) {
        const className = target.classList[index];
        if (!(className in components)) {
            continue;
        }
        const component = components[className];
        const nameIndex = names.indexOf(component.name);
        if (nameIndex === -1) {
            createView(component, target);
            hasChanged = true;
        }
        else {
            names.splice(nameIndex, 1);
        }
    }
    if (names.length) {
        const views = target.__tynyViews || {};
        hasChanged = true;
        for (let index = 0; index < names.length; index++) {
            views[names[index]].destroy();
        }
    }
    return hasChanged;
}
function applyChildList({ addedNodes, removedNodes }) {
    let hasChanged = false;
    for (let index = 0; index < addedNodes.length; index++) {
        const element = addedNodes[index];
        if (element instanceof Element) {
            apply(element, (el) => (hasChanged = connect(el) || hasChanged));
        }
    }
    for (let index = 0; index < removedNodes.length; index++) {
        const element = removedNodes[index];
        if (element instanceof Element) {
            apply(element, (el) => (hasChanged = disconnect(el) || hasChanged));
        }
    }
    return hasChanged;
}
function applyMutation(mutation, updates) {
    const { target, type } = mutation;
    if (!(target instanceof Element)) {
        return;
    }
    const update = type !== 'attributes' ? applyChildList(mutation) : applyAttribute(mutation);
    if (update && !updates.some((element) => element.contains(target))) {
        updates.push(target);
    }
}
function connect(element) {
    // IE has no classlist on svg elements
    if (!('classList' in element)) {
        return false;
    }
    const views = element.__tynyViews;
    let hasChanged = false;
    if (views) {
        for (const name in views) {
            views[name]._callConnected();
        }
    }
    for (let index = 0; index < element.classList.length; index++) {
        const className = element.classList[index];
        if (className in components) {
            hasChanged = createView(components[className], element) || hasChanged;
        }
    }
    if (hasChanged)
        rootCache = null;
    return hasChanged;
}
function createObserver() {
    if (document.body) {
        apply(document.body, connect);
    }
    addGlobalEvents();
    isInitialized = true;
    new MutationObserver((mutations) => {
        const updates = [];
        mutations.forEach((mutation) => applyMutation(mutation, updates));
        updates.forEach((element) => emitUpdate(element));
    }).observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
    });
}
function createView({ ctor, name }, element, options) {
    const instance = getView(element, name);
    if (instance) {
        if (!options) {
            return false;
        }
        else {
            instance.destroy();
        }
    }
    new ctor(Object.assign(Object.assign({}, options), { el: element }));
    return true;
}
function disconnect(element) {
    const views = element.__tynyViews;
    let hasChanged = false;
    if (views) {
        for (const name in views) {
            views[name]._callDisconnected();
            hasChanged = true;
        }
    }
    if (hasChanged)
        rootCache = null;
    return hasChanged;
}
function emitLocalUpdate(element, type) {
    const views = element.__tynyViews;
    if (!views) {
        return false;
    }
    for (const name in views) {
        if (views[name]._isConnected) {
            views[name].callUpdate(type);
        }
    }
    return true;
}
function emitThrottled(event) {
    let pending = false;
    return function invoke() {
        if (pending)
            return;
        pending = true;
        fastDom.read(() => {
            pending = false;
            emitUpdate(null, event);
        });
    };
}
function setActiveScrollEvent(value) {
    if (hasActiveScrollEvent === value)
        return;
    hasActiveScrollEvent = value;
    if (unbindScrollEvent) {
        unbindScrollEvent();
    }
    if (value) {
        window.addEventListener('touchmove', noop, { passive: false });
        window.addEventListener('touchforcechange', noop, { passive: false });
    }
    unbindScrollEvent = on(window, 'scroll', emitThrottled('scroll'), {
        passive: !value,
        capture: true,
    });
}
function emitRootUpdate(type) {
    if (rootCache) {
        return rootCache.forEach((el) => emitLocalUpdate(el, type));
    }
    const cache = (rootCache = []);
    apply(document.body, (el) => emitLocalUpdate(el, type) ? cache.push(el) : null);
}
export function emitUpdate(target, type) {
    if (!target || target === document.body) {
        return emitRootUpdate(type);
    }
    const element = toElement(target);
    parents(element)
        .reverse()
        .forEach((element) => emitLocalUpdate(element, type));
    apply(element, (element) => emitLocalUpdate(element, type));
}
export function getChildView(parent, ctor, includeSelf = false) {
    const children = getChildViews(parent, includeSelf);
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (isString(ctor) ? child.component.name === ctor : child instanceof ctor) {
            return child;
        }
    }
    return null;
}
export function getChildViews(parent, includeSelf = false) {
    const views = [];
    apply(parent, (element) => {
        if (element.__tynyViews && (includeSelf || element !== parent)) {
            views.push(...Object.values(element.__tynyViews));
        }
    });
    return views;
}
export function getParentView(element, ctor) {
    return (getView(element, ctor) ||
        (element.parentElement ? getParentView(element.parentElement, ctor) : null));
}
export function getView(element, ctor) {
    const views = getViews(element);
    if (isString(ctor)) {
        return views[ctor] || null;
    }
    for (const name in views) {
        if (views[name] instanceof ctor) {
            return views[name];
        }
    }
    return null;
}
export function getViews(element) {
    return (element && element.__tynyViews) || {};
}
export function registerViews(ctors) {
    for (const name in ctors) {
        const className = process.env.TYNY_PREFIX + ucFirst(name);
        const ctor = ctors[name];
        const component = (components[className] = ctor.prototype._component = {
            className,
            ctor,
            name,
        });
        if (isInitialized) {
            findAll(`.${className}`).forEach((element) => createView(component, element));
        }
    }
}
export function toggleActiveScrollEvent(origin, active) {
    const index = activeScrollEventOrigins.indexOf(origin);
    if (active && index === -1) {
        activeScrollEventOrigins.push(origin);
    }
    else if (!active && index !== -1) {
        activeScrollEventOrigins.splice(index, 1);
    }
    setActiveScrollEvent(activeScrollEventOrigins.length > 0);
}
if (window && window.MutationObserver) {
    if (document.readyState == 'loading') {
        once(document, 'DOMContentLoaded', () => fastDom.read(createObserver));
    }
    else {
        fastDom.read(createObserver);
    }
}
