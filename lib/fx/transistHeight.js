import { __assign } from "tslib";
import { transistDimensions } from './transistDimensions';
export function transistHeight(element, callback, options) {
    if (options === void 0) { options = {}; }
    return transistDimensions(element, callback, __assign({ transistHeight: true }, options));
}
