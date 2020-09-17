import { apply } from '../../utils/dom/node/apply';
import { breakpointEvent } from '../../services/breakpoints';
import { fastDom } from './fastdom';
import { findAll } from '../../utils/dom/node/find';
import { isElement } from '../../utils/dom/misc/isElement';
import { on } from '../../utils/dom/event/on';
import { parents } from '../../utils/dom/node/parents';
import { toElement } from '../../utils/dom/misc/toElement';
import { ucFirst } from '../../utils/lang/string/ucFirst';

import type { View, ViewClass, ViewComponent } from '../View';
import { isString } from '../../utils/lang/string';

const components: tyny.Map<ViewComponent> = {};

let isInitialized = false;

function addGlobalEvents() {
  on(window, 'load resize', emitThrottled('resize'));
  on(window, breakpointEvent, emitThrottled('breakpoint'));
  on(window, 'scroll', emitThrottled('scroll'), {
    passive: true,
    capture: true,
  });
}

function applyAttribute({ target }: MutationRecord): boolean {
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
    } else {
      names.splice(index, 1);
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
  for (let index = 0; index < addedNodes.length; index++) {
    const element = addedNodes[index] as HTMLElement;
    if (element instanceof Element) {
      apply(element, connect);
    }
  }

  for (let index = 0; index < removedNodes.length; index++) {
    const element = removedNodes[index] as HTMLElement;
    if (element instanceof Element) {
      apply(element, disconnect);
    }
  }

  return true;
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

function connect(element: HTMLElement) {
  const views = element.__tynyViews as tyny.ViewApiMap;
  if (views) {
    for (const name in views) {
      views[name]._callConnected();
    }
  }

  element.classList.forEach((className) => {
    if (className in components) {
      createView(components[className], element);
    }
  });
}

function createObserver() {
  if (document.body) {
    apply(document.body, connect);
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
): T {
  const instance = getView<T>(element, name);

  if (instance) {
    if (!options) {
      return instance;
    } else {
      instance.destroy();
    }
  }

  return new ctor({ ...options, el: element });
}

function disconnect(element: Element) {
  const views = element.__tynyViews as tyny.ViewApiMap;
  if (views) {
    for (const name in views) {
      views[name]._callDisconnected();
    }
  }
}

function emitLocalUpdate(element: Element, type?: string) {
  const views = element.__tynyViews as tyny.ViewApiMap;
  if (!views) return;

  for (const name in views) {
    if (views[name]._isConnected) {
      views[name].callUpdate(type);
    }
  }
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

export function getViews(element: any): tyny.ViewMap {
  return (element && element.__tynyViews) || {};
}

export function getViewsRecursive(
  root: HTMLElement | null | undefined
): View[] {
  const views: View[] = [];
  apply(root, (element) => {
    if (element.__tynyViews) {
      views.push(...(Object.values(element.__tynyViews) as any));
    }
  });

  return views;
}

export function registerViews(ctors: tyny.Map<ViewClass>) {
  for (const name in ctors) {
    const className = process.env.TYNY_PREFIX + ucFirst(name);
    const ctor = ctors[name];
    const component = (components[className] = ctor.prototype._component = {
      className,
      ctor,
      name,
    });

    if (isInitialized) {
      findAll(`.${className}`).forEach((element) =>
        createView(component, element)
      );
    }
  }
}

export function emitUpdate(target?: tyny.ElementLike, type?: string) {
  const element = target ? toElement(target) : document.body;

  parents(element)
    .reverse()
    .forEach((element) => emitLocalUpdate(element, type));

  apply(element, (element) => emitLocalUpdate(element, type));
}

if (window && window.MutationObserver) {
  fastDom.read(createObserver);
}
