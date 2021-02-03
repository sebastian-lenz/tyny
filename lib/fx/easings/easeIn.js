import { cubicBezier } from './cubicBezier';
const easeIn = cubicBezier(0.42, 0, 1, 1);
easeIn.toCSS = () => 'ease-in';
export { easeIn };
