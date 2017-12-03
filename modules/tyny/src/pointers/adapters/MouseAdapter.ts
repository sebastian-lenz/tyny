import { DelegateMap } from 'tyny-events';

import Adapter from './Adapter';

export default class MouseAdapter extends Adapter {
  protected muteTimeout: number | undefined;

  protected getEvents(): DelegateMap {
    return {
      mousedown: this.handleMouseDown as EventListener,
    };
  }

  protected getTrackingEvents(): DelegateMap {
    return {
      mousemove: this.handleMouseMove as EventListener,
      mouseup: this.handleMouseUp as EventListener,
    };
  }

  mute() {
    if (this.muteTimeout) clearTimeout(this.muteTimeout);
    this.muteTimeout = setTimeout(() => (this.muteTimeout = undefined), 500);
  }

  protected handleMouseDown(event: MouseEvent) {
    if (this.muteTimeout) return;
    this.pointerList.add(event, {
      adapter: this,
      clientX: event.clientX,
      clientY: event.clientY,
      id: 'mouse',
      type: 'mouse',
    });
  }

  protected handleMouseMove(event: MouseEvent) {
    this.pointerList.update(event, 'mouse', {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  protected handleMouseUp(event: MouseEvent) {
    this.pointerList.remove(event, 'mouse');
  }

  static isSupported(): boolean {
    return true;
  }
}
