import { matches } from './matches';
import { toElement } from '../misc/toElement';
export function parents(element, selector, self) {
    const parents = [];
    let parent = toElement(element);
    if (!self && parent) {
        parent = parent.parentElement;
    }
    while (parent) {
        if (!selector || matches(parent, selector)) {
            parents.push(parent);
        }
        parent = parent.parentElement;
    }
    return parents;
}
export function parentsAndSelf(element, selector) {
    return parents(element, selector, true);
}
