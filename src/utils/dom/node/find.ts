import { closest, matches } from './matches';
import { isElement, toElement, toElements } from '../misc';
import { isString } from '../../lang/string/isString';
import { notNullified } from '../../lang/misc/notNullified';
import { parent } from './parent';
import { removeAttr } from '../attr';

export type Selector = string | undefined | null;

export type SelectorContext = Document | Element;

// Formerly supported passing an element as first argument
/*
export function query(selector: string, context: SelectorContext) {
  return toNode(selector) || find(selector, getContext(selector, context));
}

export function queryAll(selector: string, context: SelectorContext) {
  const nodes = toNodes(selector);
  return (
    (nodes.length && nodes) || findAll(selector, getContext(selector, context))
  );
}

function getContext(
  selector: string,
  context: SelectorContext = document
): SelectorContext {
  return isContextSelector(selector) || isDocument(context)
    ? context
    : context.ownerDocument;
}
*/

const contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
const contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
const selectorRe = /.*?[^\\](?:,|$)/g;

function isContextSelector(selector: string): boolean {
  return isString(selector) && !!selector.match(contextSelectorRe);
}

function splitSelector(selector: string): Array<string> {
  const matches = selector.match(selectorRe);
  return matches
    ? matches.map((selector) => selector.replace(/,$/, '').trim())
    : [];
}

function query(
  selector: Selector,
  context?: SelectorContext
): NodeListOf<Element>;

function query(
  selector: Selector,
  context: SelectorContext | undefined,
  first: true
): Element | null;

function query(
  selector: Selector,
  context: SelectorContext = document,
  first?: boolean
) {
  let removes: Array<Function> = [];
  if (!selector || !isString(selector)) {
    return null;
  }

  if (selector === ':scope') {
    return first ? toElement(context) : toElements(context);
  }

  selector = selector.replace(contextSanitizeRe, '$1 *');

  if (isContextSelector(selector)) {
    removes = [];
    selector = splitSelector(selector)
      .map((selector, i) => {
        if (!isElement(context)) {
          return null;
        }

        let ctx: Element | null = context;

        if (selector[0] === '!') {
          const selectors = selector.substr(1).trim().split(' ');
          ctx = closest(parent(context), selectors[0]);
          selector = selectors.slice(1).join(' ').trim();
        } else if (selector[0] === '-') {
          const selectors = selector.substr(1).trim().split(' ');
          const prev = (ctx || context).previousElementSibling;
          ctx = matches(prev, selector.substr(1)) ? prev : null;
          selector = selectors.slice(1).join(' ');
        }

        if (!ctx) {
          return null;
        }

        if (!ctx.id) {
          ctx.id = `uk-${Date.now()}${i}`;
          removes.push(() => removeAttr(ctx, 'id'));
        }

        return `#${escape(ctx.id)} ${selector}`;
      })
      .filter(notNullified)
      .join(',');

    context = document;
  }

  try {
    return first
      ? context.querySelector(selector)
      : context.querySelectorAll(selector);
  } catch (e) {
    return null;
  } finally {
    removes && removes.forEach((remove) => remove());
  }
}

export function find(
  selector: Selector,
  context?: SelectorContext
): HTMLElement | null {
  return toElement(query(selector, context, true));
}

export function findAll(
  selector: Selector,
  context?: SelectorContext
): HTMLElement[] {
  return toElements(query(selector, context));
}
