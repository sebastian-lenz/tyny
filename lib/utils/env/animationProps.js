import { ucFirst } from '../lang/string/ucFirst';
import { inBrowser } from './browser';
const isNative = !inBrowser || !('WebkitAnimation' in document.body.style);
const eventName = isNative
    ? (value) => value.toLowerCase()
    : (value) => `webkit${value}`;
const styleName = isNative
    ? (value) => value
    : (value) => `webkit${ucFirst(value)}`;
export const onAnimationEnd = eventName('AnimationEnd');
export const onAnimationIteration = eventName('AnimationIteration');
export const onAnimationStart = eventName('AnimationStart');
export const animation = styleName('animation');
export const animationDelay = styleName('animationDelay');
export const animationDuration = styleName('animationDuration');
export const animationFillMode = styleName('animationFillMode');
export const animationName = styleName('animationName');
export const animationTimingFunction = styleName('animationTimingFunction');
export const keyframes = isNative ? '@keyframes' : '@-webkit-keyframes';
