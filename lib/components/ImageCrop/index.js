import { __rest } from "tslib";
import { jsx as _jsx } from "preact/jsx-runtime";
import cx from 'classnames';
import { Image } from '../Image';
import { ImageCrop as ImageCropView } from '../../views/ImageCrop';
import { registerView } from '../../core';
registerView('ImageCrop', ImageCropView);
export function ImageCrop(_a) {
    var { className, focusX, focusY, mode } = _a, props = __rest(_a, ["className", "focusX", "focusY", "mode"]);
    return (_jsx("div", Object.assign({ class: cx(ImageCropView.prototype.component.className, className), "data-focus-x": focusX, "data-focus-y": focusY, "data-mode": mode }, { children: _jsx(Image, Object.assign({}, props), void 0) }), void 0));
}
