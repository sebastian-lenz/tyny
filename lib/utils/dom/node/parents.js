import { matches } from './matches';
import { toElement } from '../misc/toElement';
export function parents(element, selector) {
    var parents = [];
    var parent = toElement(element);
    while (parent && (parent = parent.parentElement)) {
        if (!selector || matches(parent, selector)) {
            parents.push(parent);
        }
    }
    return parents;
}
