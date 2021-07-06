import { __rest } from "tslib";
import { jsx as _jsx } from "preact/jsx-runtime";
import cx from 'classnames';
import { Image as ImageView } from '../../views/Image';
import { registerView } from '../../core';
registerView('Image', ImageView);
export function Image(_a) {
    var { className, srcset } = _a, props = __rest(_a, ["className", "srcset"]);
    return (_jsx("img", Object.assign({}, props, { className: cx(ImageView.prototype.component.className, className), "data-srcset": srcset }), void 0));
}
