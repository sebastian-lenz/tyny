import { transistDimensions } from './transistDimensions';
export function transistWidth(element, callback, options = {}) {
    return transistDimensions(element, callback, Object.assign({ transistWidth: true }, options));
}
