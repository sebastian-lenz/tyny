import { AbstractAdapter } from './AbstractAdapter';

export class MouseAdapter extends AbstractAdapter {
  protected muteTimeout: number | undefined;

  protected getEvents(): tyny.Map<EventListener> {
    return {
      mousedown: this.handleMouseDown as EventListener,
    };
  }

  protected getTrackingEvents(): tyny.Map<EventListener> {
    return {
      mousemove: this.handleMouseMove as EventListener,
      mouseup: this.handleMouseUp as EventListener,
    };
  }

  mute() {
    if (this.muteTimeout) clearTimeout(this.muteTimeout);
    this.muteTimeout = window.setTimeout(
      () => (this.muteTimeout = undefined),
      500
    );
  }

  protected handleMouseDown(event: MouseEvent) {
    if (this.muteTimeout) return;
    this.pointerList.addPointer(event, {
      adapter: this,
      clientX: event.clientX,
      clientY: event.clientY,
      id: 'mouse',
      type: 'mouse',
    });
  }

  protected handleMouseMove(event: MouseEvent) {
    this.pointerList.movePointer(event, 'mouse', {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  protected handleMouseUp(event: MouseEvent) {
    this.pointerList.removePointer(event, 'mouse');
  }

  static isSupported(): boolean {
    return true;
  }
}
