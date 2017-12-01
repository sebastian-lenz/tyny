import { EventEmitter } from 'tyny-events';
import { whenDomReady } from 'tyny-utils';

import DispatcherEvent from './DispatcherEvent';

/**
 * A service that triggers a frame event.
 *
 * @event 'frame' (delta: number): void
 *   Triggered on each animation frame.
 */
export default class Dispatcher extends EventEmitter {
  // Timestamp of the last frame.
  private lastTime: number;

  /**
   * Dispatcher constructor.
   */
  constructor() {
    super();

    whenDomReady.then(() => {
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
          timeStep,
          type: DispatcherEvent.frameEvent,
        })
      );
    }

    this.lastTime = time;
    window.requestAnimationFrame(this.handleFrame);
  };
}
