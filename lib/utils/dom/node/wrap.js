import { append, before } from './append';
import { notNullified } from '../../lang/misc/notNullified';
import { parent } from './parent';
import { removeNode } from './removeNode';
import { toNode, toNodes } from '../misc';
export function wrapAll(element, wrapper) {
    var result = toNode(before(element, wrapper));
    if (!result) {
        return null;
    }
    while (result.firstChild) {
        result = result.firstChild;
    }
    append(result, element);
    return result;
}
export function wrapInner(element, structure) {
    return toNodes(toNodes(element).map(function (element) {
        return element.hasChildNodes()
            ? wrapAll(toNodes(element.childNodes), structure)
            : append(element, structure);
    }));
}
export function unwrap(element) {
    toNodes(element)
        .map(parent)
        .filter(function (value, index, self) { return self.indexOf(value) === index; })
        .filter(notNullified)
        .forEach(function (parent) {
        before(parent, parent.childNodes);
        removeNode(parent);
    });
}
