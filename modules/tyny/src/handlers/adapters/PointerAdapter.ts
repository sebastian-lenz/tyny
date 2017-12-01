import { DelegateMap } from 'tyny-events';

import Adapter from './Adapter';

const id = (event: PointerEvent) => `pointer-${event.pointerId}`;

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
    this.list.add(event, {
      adapter: this,
      clientX: event.clientX,
      clientY: event.clientY,
      id: id(event),
      type: event.pointerType,
    });
  }

  protected handlePointerMove(event: PointerEvent) {
    this.list.update(event, id(event), {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  protected handlePointerUp(event: PointerEvent) {
    this.list.remove(event, id(event));
  }

  static isSupported(): boolean {
    return 'PointerEvent' in window;
  }
}
