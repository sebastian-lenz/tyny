import { closest } from './closest';
import { matches } from './matches';
import { isElement, toElement, toElements } from '../misc';
import { isString } from '../../lang/string/isString';
import { notNullified } from '../../lang/misc/notNullified';
import { parent } from './parent';
import { removeAttr } from '../attr';
const contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
const contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
const selectorRe = /.*?[^\\](?:,|$)/g;
function isContextSelector(selector) {
    return isString(selector) && !!selector.match(contextSelectorRe);
}
function splitSelector(selector) {
    const matches = selector.match(selectorRe);
    return matches
        ? matches.map((selector) => selector.replace(/,$/, '').trim())
        : [];
}
function query(selector, context, first) {
    let removes = [];
    if (!selector || !isString(selector)) {
        return null;
    }
    context = context ? context : document;
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
            let ctx = context;
            if (selector[0] === '!') {
                const selectors = selector.substr(1).trim().split(' ');
                ctx = closest(parent(context), selectors[0]);
                selector = selectors.slice(1).join(' ').trim();
            }
            else if (selector[0] === '-') {
                const selectors = selector.substr(1).trim().split(' ');
                const prev = (ctx || context).previousElementSibling;
                ctx = matches(prev, selectors[0]) ? prev : null;
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
    }
    catch (e) {
        return null;
    }
    finally {
        removes && removes.forEach((remove) => remove());
    }
}
export function find(selector, context) {
    return toElement(query(selector, context, true));
}
export function findAll(selector, context) {
    return toElements(query(selector, context));
}
