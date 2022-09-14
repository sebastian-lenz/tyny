import { __rest } from "tslib";
import { createElement as _createElement } from "preact";
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import cx from 'classnames';
import { Picture as PictureView } from '../../views/Picture';
import { registerView } from '../../core';
registerView('Picture', PictureView);
export function Picture(_a) {
    var { className, focusX, focusY, sources } = _a, props = __rest(_a, ["className", "focusX", "focusY", "sources"]);
    return (_jsxs("picture", Object.assign({}, props, { className: cx(PictureView.prototype.component.className, className), "data-focus-x": focusX, "data-focus-y": focusY }, { children: [_jsx("canvas", {}), sources.map((source, index) => (_createElement("source", Object.assign({}, source, { key: index }))))] })));
}
