import { cubicBezier } from './cubicBezier';

const ease = cubicBezier(0.25, 0.1, 0.25, 1);
ease.toCSS = () => 'ease';

export { ease };
