import { ucFirst } from '../lang/string/ucFirst';
var isNative = 'ontransitionend' in document.body;
var eventName = isNative
    ? function (value) { return value.toLowerCase(); }
    : function (value) { return "webkit" + value; };
var styleName = isNative
    ? function (value) { return value; }
    : function (value) { return "webkit" + ucFirst(value); };
export var onTransitionEnd = eventName('transitionend');
export var transition = styleName('transition');
