import { cubicBezier } from './cubicBezier';
var easeOut = cubicBezier(0, 0, 0.58, 1);
easeOut.toCSS = function () { return 'ease-out'; };
export { easeOut };
