import { isPointerEvent } from './isPointerEvent';
import { isTouchEvent } from './isTouchEvent';
export function isTouch(event) {
    return ((isPointerEvent(event) && event.pointerType === 'touch') ||
        (isTouchEvent(event) && event.touches.length > 0));
}
