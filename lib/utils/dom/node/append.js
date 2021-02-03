import { $ } from './$';
import { fragment } from './fragment';
import { isString } from '../../lang/string/isString';
import { toNodes } from '../misc';
function insertNodes(value, callback) {
    const node = isString(value) ? fragment(value) : value;
    if (!node) {
        return null;
    }
    return 'length' in node ? toNodes(node).map(callback) : callback(node);
}
export function append(target, value) {
    const parent = $(target);
    if (!parent)
        return null;
    return insertNodes(value, (node) => parent.appendChild(node));
}
export function after(target, element) {
    const ref = $(target);
    if (!ref) {
        return null;
    }
    return insertNodes(element, (element) => ref.nextSibling
        ? before(ref.nextSibling, element)
        : append(ref.parentNode, element));
}
export function before(target, value) {
    const ref = $(target);
    const parent = ref ? ref.parentNode : null;
    if (!ref || !parent) {
        return null;
    }
    return insertNodes(value, (node) => parent.insertBefore(node, ref));
}
export function prepend(target, value) {
    const parent = $(target);
    if (!parent) {
        return null;
    }
    if (!parent.hasChildNodes()) {
        return append(parent, value);
    }
    else {
        return insertNodes(value, (node) => parent.insertBefore(node, parent.firstChild));
    }
}
