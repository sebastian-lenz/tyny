import { Event, EventOptions } from 'tyny-events';
import Dispatcher from './Dispatcher';

export interface DispatcherEventOptions extends EventOptions<Dispatcher> {
  timeStep: number;
}

export default class DispatcherEvent extends Event<Dispatcher> {
  readonly timeStep: number;

  static readonly frameEvent: string = 'frame';

  constructor(options: DispatcherEventOptions) {
    super(options);
    this.timeStep = options.timeStep;
  }
}
