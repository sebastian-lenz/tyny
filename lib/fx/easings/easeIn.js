import { cubicBezier } from './cubicBezier';
var easeIn = cubicBezier(0.42, 0, 1, 1);
easeIn.toCSS = function () { return 'ease-in'; };
export { easeIn };
