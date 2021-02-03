import { transistDimensions } from './transistDimensions';
export function transistHeight(element, callback, options = {}) {
    return transistDimensions(element, callback, Object.assign({ transistHeight: true }, options));
}
