import { EventEmitter } from 'tyny-events';
import { whenDomReady } from 'tyny-utils';

import DispatcherEvent from './DispatcherEvent';

/**
 * A service that triggers a frame event.
 */
export default class Dispatcher extends EventEmitter {
  // Timestamp of the last frame.
  private lastTime: number = -1;

  /**
   * Dispatcher constructor.
   */
  constructor() {
    super();

    whenDomReady().then(() => {
      this.lastTime = window.performance.now();
      window.requestAnimationFrame(this.handleFrame);
    });
  }

  /**
   * Animation frame handler.
   */
  private handleFrame = (time: number) => {
    const timeStep = time - this.lastTime;
    if (timeStep > 0) {
      this.emit(
        new DispatcherEvent({
          target: this,
          timeStep,
          type: DispatcherEvent.frameEvent,
        })
      );
    }

    this.lastTime = time;
    window.requestAnimationFrame(this.handleFrame);
  };
}
