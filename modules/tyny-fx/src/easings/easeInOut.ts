import { EasingFunction } from '../index';
import cubicBezier from './cubicBezier';

/**
 * https://www.w3.org/TR/css-timing-1/#cubic-bezier-timing-functions
 */
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
easeInOut.toCSS = () => 'ease-in-ou';
export default easeInOut;
