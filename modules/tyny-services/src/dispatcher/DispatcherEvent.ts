import { Event, EventOptions } from 'tyny-events';

export interface DispatcherEventOptions extends EventOptions {
  timeStep: number;
}

export default class DispatcherEvent extends Event {
  readonly timeStep: number;

  static readonly frameEvent: string = 'frame';

  constructor(options: DispatcherEventOptions) {
    super(options);
    this.timeStep = options.timeStep;
  }
}
