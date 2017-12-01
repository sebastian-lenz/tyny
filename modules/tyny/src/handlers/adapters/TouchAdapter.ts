import { DelegateMap } from 'tyny-events';

import Adapter from './Adapter';
import MouseAdapter from './MouseAdapter';
import PointerList from '../PointerList';

const id = (touch: Touch) => `touch-${touch.identifier}`;
const each = (touches: TouchList, callback: (touch: Touch) => void) => {
  for (let index = 0; index < touches.length; index += 1) {
    callback(touches[index]);
  }
};

export default class TouchAdapter extends Adapter {
  mouseAdapter: MouseAdapter;

  constructor(element: HTMLElement, pointers: PointerList) {
    super(element, pointers);
    this.mouseAdapter = new MouseAdapter(element, pointers);
  }

  protected getEvents(): DelegateMap {
    return {
      touchstart: this.handleTouchStart as EventListener,
    };
  }

  protected getTrackingEvents(): DelegateMap {
    return {
      touchmove: this.handleTouchMove as EventListener,
      touchend: this.handleTouchEnd as EventListener,
      touchcancel: this.handleTouchEnd as EventListener,
    };
  }

  protected handleTouchStart(event: TouchEvent): void {
    each(event.changedTouches, touch => {
      this.list.add(event, {
        adapter: this,
        clientX: touch.clientX,
        clientY: touch.clientY,
        id: id(touch),
        type: 'touch',
      });
    });
  }

  protected handleTouchMove(event: TouchEvent): void {
    each(event.changedTouches, touch => {
      this.list.update(event, id(touch), {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    });
  }

  protected handleTouchEnd(event: TouchEvent): void {
    this.mouseAdapter.mute();
    each(event.changedTouches, touch => {
      this.list.remove(event, id(touch));
    });
  }

  static isSupported(): boolean {
    return 'ontouchstart' in window;
  }
}
