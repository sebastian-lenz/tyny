import { EasingFunction } from '../index';
import cubicBezier from './cubicBezier';

/**
 * https://www.w3.org/TR/css-timing-1/#cubic-bezier-timing-functions
 */
const easeOut = cubicBezier(0, 0, 0.58, 1);
easeOut.toCSS = () => 'ease-out';
export default easeOut;
