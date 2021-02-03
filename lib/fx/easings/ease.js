import { cubicBezier } from './cubicBezier';
var ease = cubicBezier(0.25, 0.1, 0.25, 1);
ease.toCSS = function () { return 'ease'; };
export { ease };
