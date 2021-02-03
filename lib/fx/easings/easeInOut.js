import { cubicBezier } from './cubicBezier';
var easeInOut = cubicBezier(0.42, 0, 0.58, 1);
easeInOut.toCSS = function () { return 'ease-in-ou'; };
export { easeInOut };
