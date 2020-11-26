import { ucFirst } from '../lang/string/ucFirst';

const isNative = !('WebkitAnimation' in document.body.style);

const eventName = isNative
  ? (value: string) => value.toLowerCase()
  : (value: string) => `webkit${value}`;

const styleName = isNative
  ? (value: string) => value
  : (value: string) => `webkit${ucFirst(value)}`;

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
