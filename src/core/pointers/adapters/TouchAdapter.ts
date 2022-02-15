import { AbstractAdapter } from './AbstractAdapter';
import { MouseAdapter } from './MouseAdapter';

import type { PointerBehaviour } from '../PointerBehaviour';

export let isIOSFix = false;

const id = (touch: Touch) => `touch-${touch.identifier}`;

const each = (touches: TouchList, callback: (touch: Touch) => void) => {
  for (let index = 0; index < touches.length; index += 1) {
    callback(touches[index]);
  }
};

export class TouchAdapter extends AbstractAdapter {
  mouseAdapter: MouseAdapter;

  constructor(element: HTMLElement, pointerList: PointerBehaviour) {
    super(element, pointerList);

    this.usePassiveEvents = false;
    this.mouseAdapter = new MouseAdapter(element, pointerList);
  }

  protected getEvents(): tyny.Map<EventListener> {
    return {
      touchstart: this.handleTouchStart as EventListener,
    };
  }

  protected getTrackingEvents(): tyny.Map<EventListener> {
    return {
      touchmove: this.handleTouchMove as EventListener,
      touchend: this.handleTouchEnd as EventListener,
      touchcancel: this.handleTouchEnd as EventListener,
    };
  }

  protected handleTouchStart(event: TouchEvent): void {
    each(event.changedTouches, (touch) => {
      this.pointerList.addPointer(event, {
        adapter: this,
        clientX: touch.clientX,
        clientY: touch.clientY,
        id: id(touch),
        type: 'touch',
      });
    });
  }

  protected handleTouchMove(event: TouchEvent): void {
    each(event.changedTouches, (touch) => {
      this.pointerList.movePointer(event, id(touch), {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    });
  }

  protected handleTouchEnd(event: TouchEvent): void {
    this.mouseAdapter.mute();
    each(event.changedTouches, (touch) => {
      this.pointerList.removePointer(event, id(touch));
    });
  }

  static isSupported(): boolean {
    if (isIOSFix) {
      return true;
    }

    let isSupported = 'ontouchstart' in window;
    if (isSupported) {
      isIOSFix = true;
      window.addEventListener('touchmove', function () {}, { passive: false });
    }

    return isSupported;
  }
}
