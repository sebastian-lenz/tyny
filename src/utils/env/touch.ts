import { inBrowser } from './browser';

const hasTouchEvents = inBrowser && 'ontouchstart' in window;

const hasPointerEvents = inBrowser && window.PointerEvent;

export const hasTouch =
  inBrowser && (hasTouchEvents || navigator.maxTouchPoints);

export const pointerDown = hasPointerEvents
  ? 'pointerdown'
  : hasTouchEvents
  ? 'touchstart'
  : 'mousedown';

export const pointerMove = hasPointerEvents
  ? 'pointermove'
  : hasTouchEvents
  ? 'touchmove'
  : 'mousemove';

export const pointerUp = hasPointerEvents
  ? 'pointerup'
  : hasTouchEvents
  ? 'touchend'
  : 'mouseup';

export const pointerEnter = hasPointerEvents
  ? 'pointerenter'
  : hasTouchEvents
  ? ''
  : 'mouseenter';

export const pointerLeave = hasPointerEvents
  ? 'pointerleave'
  : hasTouchEvents
  ? ''
  : 'mouseleave';

export const pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel';
