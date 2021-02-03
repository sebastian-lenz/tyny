import { ucFirst } from '../lang/string/ucFirst';
var isNative = !('WebkitAnimation' in document.body.style);
var eventName = isNative
    ? function (value) { return value.toLowerCase(); }
    : function (value) { return "webkit" + value; };
var styleName = isNative
    ? function (value) { return value; }
    : function (value) { return "webkit" + ucFirst(value); };
export var onAnimationEnd = eventName('AnimationEnd');
export var onAnimationIteration = eventName('AnimationIteration');
export var onAnimationStart = eventName('AnimationStart');
export var animation = styleName('animation');
export var animationDelay = styleName('animationDelay');
export var animationDuration = styleName('animationDuration');
export var animationFillMode = styleName('animationFillMode');
export var animationName = styleName('animationName');
export var animationTimingFunction = styleName('animationTimingFunction');
export var keyframes = isNative ? '@keyframes' : '@-webkit-keyframes';
