import { isMouseEvent } from './isMouseEvent';
import { isTouchEvent } from './isTouchEvent';

export function getEventPos(e: Event): tyny.Point {
  let cursor: tyny.ClientPoint | undefined;
  if (isMouseEvent(e)) {
    cursor = e;
  } else if (isTouchEvent(e)) {
    cursor = e.touches ? e.touches[0] : e.changedTouches[0];
  }

  return cursor ? { x: cursor.clientX, y: cursor.clientY } : { x: 0, y: 0 };
}
