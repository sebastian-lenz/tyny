import { inBrowser } from './browser';
import { ucFirst } from '../lang/string/ucFirst';

const styleName =
  !inBrowser || 'transform' in document.documentElement.style
    ? (value: string) => value
    : (value: string) => `webkit${ucFirst(value)}`;

export const perspective: 'perspective' = styleName('perspective') as any;
export const transform: 'transform' = styleName('transform') as any;
export const transformOrigin: 'transformOrigin' = styleName(
  'transformOrigin'
) as any;
