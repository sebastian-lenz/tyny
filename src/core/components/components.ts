import { apply } from '../../utils/dom/node/apply';
import { breakpointEvent } from '../../services/breakpoints';
import { fastDom } from './fastdom';
import { findAll } from '../../utils/dom/node/find';
import { isElement } from '../../utils/dom/misc/isElement';
import { isString } from '../../utils/lang/string';
import { noop } from '../../utils/lang/function';
import { on } from '../../utils/dom/event/on';
import { once } from '../../utils/dom/event';
import { parents } from '../../utils/dom/node/parents';
import { toElement } from '../../utils/dom/misc/toElement';
import { ucFirst } from '../../utils/lang/string/ucFirst';
import type { View, ViewClass, ViewComponent } from '../View';

export interface RegisterViewOptions {
  className?: string;
  upgrade?: boolean;
}

const activeScrollEventOrigins: Array<any> = [];
const components: tyny.Map<ViewComponent> = {};
let hasActiveScrollEvent: boolean | null = null;
let isInitialized = false;
let unbindScrollEvent: Function | null = null;
let rootCache: Array<HTMLElement> | null = null;

function addGlobalEvents() {
  on(window, 'load resize', emitThrottled('resize'));
  on(window, breakpointEvent, emitThrottled('breakpoint'));

  setActiveScrollEvent(activeScrollEventOrigins.length > 0);
}

function applyAttribute({ target }: MutationRecord): boolean {
  if (!isElement(target)) {
    return false;
  }

  const names = target.__tynyViews ? Object.keys(target.__tynyViews) : [];
  let hasChanged = false;

  for (let index = 0; index < target.classList.length; index++) {
    const className: string = target.classList[index];
    if (!(className in components)) {
      continue;
    }

    const component = components[className];
    const nameIndex = names.indexOf(component.name);
    if (nameIndex === -1) {
      createView(component, target);
      hasChanged = true;
    } else {
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

function applyChildList({ addedNodes, removedNodes }: MutationRecord): boolean {
  let hasChanged = false;
  for (let index = 0; index < addedNodes.length; index++) {
    const element = addedNodes[index] as HTMLElement;
    if (element instanceof Element) {
      hasChanged = connect(element) || hasChanged;
    }
  }

  for (let index = 0; index < removedNodes.length; index++) {
    const element = removedNodes[index] as HTMLElement;
    if (element instanceof Element) {
      hasChanged = disconnect(element) || hasChanged;
    }
  }

  return hasChanged;
}

function applyMutation(mutation: MutationRecord, updates: Array<Element>) {
  const { target, type } = mutation;
  if (!(target instanceof Element)) {
    return;
  }

  const update =
    type !== 'attributes' ? applyChildList(mutation) : applyAttribute(mutation);

  if (update && !updates.some((element) => element.contains(target))) {
    updates.push(target);
  }
}

function connect(root: HTMLElement): boolean {
  let hasChanged = false;

  function preCallback(element: HTMLElement) {
    // IE has no classlist on svg elements
    if (!('classList' in element)) {
      return;
    }

    for (let index = 0; index < element.classList.length; index++) {
      const className = element.classList[index];
      if (className in components) {
        hasChanged = createView(components[className], element) || hasChanged;
      }
    }
  }

  function postCallback(element: HTMLElement) {
    const views = element.__tynyViews as tyny.ViewApiMap;
    if (views) {
      for (const name in views) {
        views[name]._callConnected();
      }
    }
  }

  apply(root, preCallback, postCallback);

  if (hasChanged) rootCache = null;
  return hasChanged;
}

function createObserver() {
  if (document.body) {
    connect(document.body);
  }

  addGlobalEvents();
  isInitialized = true;

  new MutationObserver((mutations) => {
    const updates: Array<Element> = [];
    mutations.forEach((mutation) => applyMutation(mutation, updates));
    updates.forEach((element) => emitUpdate(element));
  }).observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
}

function createView<T extends View = View>(
  { ctor, name }: ViewComponent<T>,
  element: HTMLElement,
  options?: {}
): boolean {
  const instance = getView<T>(element, name);
  if (instance) {
    if (!options) {
      return false;
    } else {
      instance.destroy();
    }
  }

  new ctor({ ...options, el: element });
  return true;
}

function disconnect(root: HTMLElement) {
  let hasChanged = false;

  function preCallback(element: Element) {
    const views = element.__tynyViews as tyny.ViewApiMap;

    if (views) {
      for (const name in views) {
        views[name]._callDisconnected();
        hasChanged = true;
      }
    }
  }

  apply(root, preCallback);

  if (hasChanged) rootCache = null;
  return hasChanged;
}

function emitLocalUpdate(element: Element, type?: string) {
  const views = element.__tynyViews as tyny.ViewApiMap;
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

function emitThrottled(event: string) {
  let pending = false;

  return function invoke() {
    if (pending) return;
    pending = true;

    fastDom.read(() => {
      pending = false;
      emitUpdate(null, event);
    });
  };
}

function setActiveScrollEvent(value: boolean) {
  if (hasActiveScrollEvent === value) return;
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

function emitRootUpdate(type?: string) {
  if (rootCache) {
    return rootCache.forEach((el) => emitLocalUpdate(el, type));
  }

  const cache = (rootCache = [] as Array<HTMLElement>);
  apply(document.body, (el) =>
    emitLocalUpdate(el, type) ? cache.push(el) : null
  );
}

export function clearViewCache() {
  rootCache = null;
}

export function createViews(element: HTMLElement) {
  connect(element);
}

export function emitUpdate(target?: tyny.ElementLike, type?: string) {
  if (!target || target === document.body) {
    return emitRootUpdate(type);
  }

  const element = toElement(target);
  parents(element)
    .reverse()
    .forEach((element) => emitLocalUpdate(element, type));

  apply(element, (element) => emitLocalUpdate(element, type));
}

export function getChildView<TView extends View = View>(
  parent: HTMLElement | null | undefined,
  ctor: ViewClass<TView> | string,
  includeSelf: boolean = false
): TView | null {
  const children = getChildViews(parent, includeSelf);
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (
      isString(ctor) ? child.component.name === ctor : child instanceof ctor
    ) {
      return child as TView;
    }
  }

  return null;
}

export function getChildViews(
  parent: HTMLElement | null | undefined,
  includeSelf: boolean = false
): View[] {
  const views: View[] = [];
  apply(parent, (element) => {
    if (element.__tynyViews && (includeSelf || element !== parent)) {
      views.push(...(Object.values(element.__tynyViews) as any));
    }
  });

  return views;
}

export function getParentView<TView extends View = View>(
  element: any,
  ctor: ViewClass<TView> | string
): TView | null {
  return (
    getView(element, ctor) ||
    (element.parentElement ? getParentView(element.parentElement, ctor) : null)
  );
}

export function getView<TView extends View = View>(
  element: any,
  ctor: ViewClass<TView> | string
): TView | null {
  const views = getViews(element);
  if (isString(ctor)) {
    return (views[ctor] as TView) || null;
  }

  for (const name in views) {
    if (views[name] instanceof ctor) {
      return views[name] as TView;
    }
  }

  return null;
}

export function getViewClassName(name: string): string {
  return process.env.TYNY_PREFIX + ucFirst(name);
}

export function getViews(element: any): tyny.ViewMap {
  return (element && element.__tynyViews) || {};
}

function unregisterView(className: string) {
  const { name } = components[className];
  delete components[className];

  apply(document.body, (el) => {
    if (el.__tynyViews && name in el.__tynyViews) {
      const view = el.__tynyViews[name] as tyny.ViewApi;
      delete el.__tynyViews[name];
      view.destroy();
    }
  });
}

export function registerView(
  name: string,
  ctor: ViewClass,
  {
    className = getViewClassName(name),
    upgrade = false,
  }: RegisterViewOptions = {}
) {
  const component = (ctor.prototype._component = {
    className,
    name,
    ctor,
  });

  if (className in components) {
    if (upgrade) {
      unregisterView(className);
    } else {
      return;
    }
  }

  components[className] = component;

  if (isInitialized) {
    rootCache = null;
    findAll(`.${className}`).forEach((element) =>
      createView(component, element)
    );
  }
}

export function registerViews(
  ctors: tyny.Map<ViewClass>,
  options: RegisterViewOptions = {}
) {
  for (const name in ctors) {
    registerView(name, ctors[name], options);
  }
}

export function toggleActiveScrollEvent(origin: any, active: boolean) {
  const index = activeScrollEventOrigins.indexOf(origin);
  if (active && index === -1) {
    activeScrollEventOrigins.push(origin);
  } else if (!active && index !== -1) {
    activeScrollEventOrigins.splice(index, 1);
  }

  setActiveScrollEvent(activeScrollEventOrigins.length > 0);
}

if (typeof window !== 'undefined' && window.MutationObserver) {
  if (document.readyState == 'loading') {
    once(document, 'DOMContentLoaded', () => fastDom.read(createObserver));
  } else {
    fastDom.read(createObserver);
  }
}
