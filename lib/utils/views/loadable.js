import { View, getChildViews } from '../../core';
export function isLoadable(value) {
    return value instanceof View && typeof value.load === 'function';
}
export function whenLoaded(element) {
    return Promise.all(getChildViews(element, true)
        .filter(isLoadable)
        .map((view) => view.load()));
}
export function whenViewLoaded(view) {
    return isLoadable(view) ? view.load() : Promise.resolve();
}
