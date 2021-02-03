import { ucFirst } from '../lang/string/ucFirst';
const styleName = 'transform' in document.body.style
    ? (value) => value
    : (value) => `webkit${ucFirst(value)}`;
export const perspective = styleName('perspective');
export const transform = styleName('transform');
export const transformOrigin = styleName('transformOrigin');
