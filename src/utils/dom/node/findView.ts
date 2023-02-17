import { findAll, Selector, SelectorContext } from './find';
import type { View, ViewClass } from '../../../core';

export function findView<T extends View>(
  selector: Selector,
  context?: SelectorContext,
  ctor?: string | ViewClass<T>
): T | null {
  return findAllViews(selector, context, ctor)[0] || null;
}

export function findAllViews<T extends View>(
  selector: Selector,
  context?: SelectorContext,
  ctor?: string | ViewClass<T>
): T[] {
  return findAll(selector, context).reduce((result, element) => {
    const views = element.__tynyViews;
    if (!views) return result;

    if (!ctor) {
      result.push(...(Object.values(views) as Array<T>));
    } else if (typeof ctor === 'string') {
      if (ctor in views) {
        result.push(views[ctor] as T);
      }
    } else {
      for (const name in views) {
        const view = views[name];
        if (view instanceof ctor) {
          result.push(view);
        }
      }
    }

    return result;
  }, [] as T[]);
}
