import { cubicBezier } from './cubicBezier';

const easeOut = cubicBezier(0, 0, 0.58, 1);
easeOut.toCSS = () => 'ease-out';

export { easeOut };
