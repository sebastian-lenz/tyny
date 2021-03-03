import { isMouseEvent } from './isMouseEvent';
import { isTouchEvent } from './isTouchEvent';
export function getEventPos(e) {
    let cursor;
    if (isMouseEvent(e)) {
        cursor = e;
    }
    else if (isTouchEvent(e)) {
        cursor = e.touches ? e.touches[0] : e.changedTouches[0];
    }
    return cursor ? { x: cursor.clientX, y: cursor.clientY } : { x: 0, y: 0 };
}