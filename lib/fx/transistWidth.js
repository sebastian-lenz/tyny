import { __assign } from "tslib";
import { transistDimensions } from './transistDimensions';
export function transistWidth(element, callback, options) {
    if (options === void 0) { options = {}; }
    return transistDimensions(element, callback, __assign({ transistWidth: true }, options));
}
