import { __assign } from "tslib";
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
var activeScrollEventOrigins = [];
var components = {};
var hasActiveScrollEvent = null;
var isInitialized = false;
var unbindScrollEvent = null;
function addGlobalEvents() {
    on(window, 'load resize', emitThrottled('resize'));
    on(window, breakpointEvent, emitThrottled('breakpoint'));
    setActiveScrollEvent(activeScrollEventOrigins.length > 0);
}
function applyAttribute(_a) {
    var target = _a.target;
    if (!isElement(target)) {
        return false;
    }
    var names = target.__tynyViews ? Object.keys(target.__tynyViews) : [];
    var hasChanged = false;
    for (var index = 0; index < target.classList.length; index++) {
        var className = target.classList[index];
        if (!(className in components)) {
            continue;
        }
        var component = components[className];
        var nameIndex = names.indexOf(component.name);
        if (nameIndex === -1) {
            createView(component, target);
            hasChanged = true;
        }
        else {
            names.splice(nameIndex, 1);
        }
    }
    if (names.length) {
        var views = target.__tynyViews || {};
        hasChanged = true;
        for (var index = 0; index < names.length; index++) {
            views[names[index]].destroy();
        }
    }
    return hasChanged;
}
function applyChildList(_a) {
    var addedNodes = _a.addedNodes, removedNodes = _a.removedNodes;
    for (var index = 0; index < addedNodes.length; index++) {
        var element = addedNodes[index];
        if (element instanceof Element) {
            apply(element, connect);
        }
    }
    for (var index = 0; index < removedNodes.length; index++) {
        var element = removedNodes[index];
        if (element instanceof Element) {
            apply(element, disconnect);
        }
    }
    return true;
}
function applyMutation(mutation, updates) {
    var target = mutation.target, type = mutation.type;
    if (!(target instanceof Element)) {
        return;
    }
    var update = type !== 'attributes' ? applyChildList(mutation) : applyAttribute(mutation);
    if (update && !updates.some(function (element) { return element.contains(target); })) {
        updates.push(target);
    }
}
function connect(element) {
    // IE has no classlist on svg elements
    if (!('classList' in element)) {
        return;
    }
    var views = element.__tynyViews;
    if (views) {
        for (var name_1 in views) {
            views[name_1]._callConnected();
        }
    }
    for (var index = 0; index < element.classList.length; index++) {
        var className = element.classList[index];
        if (className in components) {
            createView(components[className], element);
        }
    }
}
function createObserver() {
    if (document.body) {
        apply(document.body, connect);
    }
    addGlobalEvents();
    isInitialized = true;
    new MutationObserver(function (mutations) {
        var updates = [];
        mutations.forEach(function (mutation) { return applyMutation(mutation, updates); });
        updates.forEach(function (element) { return emitUpdate(element); });
    }).observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
    });
}
function createView(_a, element, options) {
    var ctor = _a.ctor, name = _a.name;
    var instance = getView(element, name);
    if (instance) {
        if (!options) {
            return instance;
        }
        else {
            instance.destroy();
        }
    }
    return new ctor(__assign(__assign({}, options), { el: element }));
}
function disconnect(element) {
    var views = element.__tynyViews;
    if (views) {
        for (var name_2 in views) {
            views[name_2]._callDisconnected();
        }
    }
}
function emitLocalUpdate(element, type) {
    var views = element.__tynyViews;
    if (!views)
        return;
    for (var name_3 in views) {
        if (views[name_3]._isConnected) {
            views[name_3].callUpdate(type);
        }
    }
}
function emitThrottled(event) {
    var pending = false;
    return function invoke() {
        if (pending)
            return;
        pending = true;
        fastDom.read(function () {
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
export function emitUpdate(target, type) {
    var element = target ? toElement(target) : document.body;
    parents(element)
        .reverse()
        .forEach(function (element) { return emitLocalUpdate(element, type); });
    apply(element, function (element) { return emitLocalUpdate(element, type); });
}
export function getChildView(parent, ctor, includeSelf) {
    if (includeSelf === void 0) { includeSelf = false; }
    var children = getChildViews(parent, includeSelf);
    for (var index = 0; index < children.length; index++) {
        var child = children[index];
        if (isString(ctor) ? child.component.name === ctor : child instanceof ctor) {
            return child;
        }
    }
    return null;
}
export function getChildViews(parent, includeSelf) {
    if (includeSelf === void 0) { includeSelf = false; }
    var views = [];
    apply(parent, function (element) {
        if (element.__tynyViews && (includeSelf || element !== parent)) {
            views.push.apply(views, Object.values(element.__tynyViews));
        }
    });
    return views;
}
export function getParentView(element, ctor) {
    return (getView(element, ctor) ||
        (element.parentElement ? getParentView(element.parentElement, ctor) : null));
}
export function getView(element, ctor) {
    var views = getViews(element);
    if (isString(ctor)) {
        return views[ctor] || null;
    }
    for (var name_4 in views) {
        if (views[name_4] instanceof ctor) {
            return views[name_4];
        }
    }
    return null;
}
export function getViews(element) {
    return (element && element.__tynyViews) || {};
}
export function registerViews(ctors) {
    var _loop_1 = function (name_5) {
        var className = process.env.TYNY_PREFIX + ucFirst(name_5);
        var ctor = ctors[name_5];
        var component = (components[className] = ctor.prototype._component = {
            className: className,
            ctor: ctor,
            name: name_5,
        });
        if (isInitialized) {
            findAll("." + className).forEach(function (element) {
                return createView(component, element);
            });
        }
    };
    for (var name_5 in ctors) {
        _loop_1(name_5);
    }
}
export function toggleActiveScrollEvent(origin, active) {
    var index = activeScrollEventOrigins.indexOf(origin);
    if (active && index === -1) {
        activeScrollEventOrigins.push(origin);
    }
    else if (!active && index !== -1) {
        activeScrollEventOrigins.splice(index, 1);
    }
    setActiveScrollEvent(activeScrollEventOrigins.length > 0);
}
if (window && window.MutationObserver) {
    fastDom.read(createObserver);
}
