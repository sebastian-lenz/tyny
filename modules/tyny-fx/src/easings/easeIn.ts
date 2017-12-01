import { EasingFunction } from '../index';
import cubicBezier from './cubicBezier';

/**
 * https://www.w3.org/TR/css-timing-1/#cubic-bezier-timing-functions
 */
const easeIn = cubicBezier(0.42, 0, 1, 1);
easeIn.toCSS = () => 'ease-in';
export default easeIn;
