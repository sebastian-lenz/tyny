import { DelegateMap } from 'tyny-events';
import { memoize } from 'tyny-utils';

import Adapter from './Adapter';

const id = (event: PointerEvent) => `pointer-${event.pointerId}`;
const isSupported = memoize(() => {
  const result = 'PointerEvent' in window;
  if (result) {
    try {
      window.addEventListener('touchmove', function() {}, { passive: true });
    } catch (e) {
      window.addEventListener('touchmove', function() {});
    }
  }

  return result;
});

export default class PointerAdapter extends Adapter {
  protected getEvents(): DelegateMap {
    return {
      pointerdown: this.handlePointerDown as EventListener,
    };
  }

  protected getTrackingEvents(): DelegateMap {
    return {
      pointermove: this.handlePointerMove as EventListener,
      pointerup: this.handlePointerUp as EventListener,
      pointercancel: this.handlePointerUp as EventListener,
    };
  }

  protected handlePointerDown(event: PointerEvent) {
    if (event.button !== 0) return;
    this.pointerList.add(event, {
      adapter: this,
      clientX: event.clientX,
      clientY: event.clientY,
      id: id(event),
      type: event.pointerType,
    });
  }

  protected handlePointerMove(event: PointerEvent) {
    this.pointerList.update(event, id(event), {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  protected handlePointerUp(event: PointerEvent) {
    this.pointerList.remove(event, id(event));
  }

  static isSupported(): boolean {
    return isSupported();
  }
}
