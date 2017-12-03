import { Event, EventOptions } from 'tyny-events';

import PointerEvent from '../PointerEvent';

export interface TransformEventOptions extends EventOptions {
  listEvent: PointerEvent;
}

export default class TransformEvent extends Event {
  readonly listEvent: PointerEvent;

  static transformEvent: string = 'transform';
  static transformEndEvent: string = 'transformEnd';
  static transformStartEvent: string = 'transformStart';

  constructor(options: TransformEventOptions) {
    super(options);
    this.listEvent = options.listEvent;
  }
}
