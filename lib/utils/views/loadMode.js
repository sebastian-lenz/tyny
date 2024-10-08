import { getChildViews, View } from '../../core';
export var LoadMode;
(function (LoadMode) {
    LoadMode[LoadMode["Always"] = 0] = "Always";
    LoadMode[LoadMode["Explicit"] = 1] = "Explicit";
    LoadMode[LoadMode["Visibility"] = 2] = "Visibility";
})(LoadMode || (LoadMode = {}));
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
