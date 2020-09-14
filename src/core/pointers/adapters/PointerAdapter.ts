import { AbstractAdapter } from './AbstractAdapter';
import { isUndefined } from '../../../utils/lang/misc';
import { PointerType } from '../Pointer';

let isSupported: boolean | undefined = undefined;

const id = (event: PointerEvent) => `pointer-${event.pointerId}`;

export class PointerAdapter extends AbstractAdapter {
  protected getEvents(): tyny.Map<EventListener> {
    return {
      pointerdown: this.handlePointerDown as EventListener,
    };
  }

  protected getTrackingEvents(): tyny.Map<EventListener> {
    return {
      pointermove: this.handlePointerMove as EventListener,
      pointerup: this.handlePointerUp as EventListener,
      pointercancel: this.handlePointerUp as EventListener,
    };
  }

  protected handlePointerDown(event: PointerEvent) {
    if (event.button !== 0) {
      return;
    }

    this.pointerList.addPointer(event, {
      adapter: this,
      clientX: event.clientX,
      clientY: event.clientY,
      id: id(event),
      type: event.pointerType as PointerType,
    });
  }

  protected handlePointerMove(event: PointerEvent) {
    this.pointerList.movePointer(event, id(event), {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  protected handlePointerUp(event: PointerEvent) {
    this.pointerList.removePointer(event, id(event));
  }

  static isSupported(): boolean {
    if (!isUndefined(isSupported)) {
      return isSupported;
    }

    isSupported = 'PointerEvent' in window;
    if (isSupported) {
      try {
        window.addEventListener('pointermove', function () {}, {
          passive: false,
        });
      } catch (e) {
        window.addEventListener('pointermove', function () {});
      }
    }

    return isSupported;
  }
}
