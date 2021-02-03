import { cubicBezier } from './cubicBezier';
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
easeInOut.toCSS = () => 'ease-in-ou';
export { easeInOut };
