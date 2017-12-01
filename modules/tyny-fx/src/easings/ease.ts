import { EasingFunction } from '../index';
import cubicBezier from './cubicBezier';

/**
 * https://www.w3.org/TR/css-timing-1/#cubic-bezier-timing-functions
 */
const ease = cubicBezier(0.25, 0.1, 0.25, 1);
ease.toCSS = () => 'ease';
export default ease;
