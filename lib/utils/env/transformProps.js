import { ucFirst } from '../lang/string/ucFirst';
var styleName = 'transform' in document.body.style
    ? function (value) { return value; }
    : function (value) { return "webkit" + ucFirst(value); };
export var perspective = styleName('perspective');
export var transform = styleName('transform');
export var transformOrigin = styleName('transformOrigin');
