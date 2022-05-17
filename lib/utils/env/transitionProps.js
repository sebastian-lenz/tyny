import { inBrowser } from './browser';
import { ucFirst } from '../lang/string/ucFirst';
const isNative = !inBrowser || 'ontransitionend' in document.documentElement;
const eventName = isNative
    ? (value) => value.toLowerCase()
    : (value) => `webkit${value}`;
const styleName = isNative
    ? (value) => value
    : (value) => `webkit${ucFirst(value)}`;
export const onTransitionEnd = eventName('transitionend');
export const onTransitionCancel = eventName('transitioncancel');
export const transition = styleName('transition');
