import { inBrowser } from './browser';
var hasTouchEvents = inBrowser && 'ontouchstart' in window;
var hasPointerEvents = inBrowser && window.PointerEvent;
export var hasTouch = inBrowser && (hasTouchEvents || navigator.maxTouchPoints);
export var pointerDown = hasPointerEvents
    ? 'pointerdown'
    : hasTouchEvents
        ? 'touchstart'
        : 'mousedown';
export var pointerMove = hasPointerEvents
    ? 'pointermove'
    : hasTouchEvents
        ? 'touchmove'
        : 'mousemove';
export var pointerUp = hasPointerEvents
    ? 'pointerup'
    : hasTouchEvents
        ? 'touchend'
        : 'mouseup';
export var pointerEnter = hasPointerEvents
    ? 'pointerenter'
    : hasTouchEvents
        ? ''
        : 'mouseenter';
export var pointerLeave = hasPointerEvents
    ? 'pointerleave'
    : hasTouchEvents
        ? ''
        : 'mouseleave';
export var pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel';
