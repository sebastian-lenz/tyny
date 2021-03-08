import { getChildViews, View } from '../../core';
export function isLoadModeView(value) {
    return value instanceof View && 'setLoadMode' in value;
}
export function setChildLoadMode(el, mode) {
    getChildViews(el).forEach((view) => {
        if (isLoadModeView(view)) {
            view.setLoadMode(mode);
        }
    });
}
