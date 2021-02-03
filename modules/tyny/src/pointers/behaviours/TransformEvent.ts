import { Event, EventOptions } from 'tyny-events';

import PointerListEvent from '../PointerListEvent';
import TransformBehaviour from './TransformBehaviour';

export interface TransformEventOptions
  extends EventOptions<TransformBehaviour> {
  listEvent: PointerListEvent;
}

export default class TransformEvent extends Event<TransformBehaviour> {
  readonly listEvent: PointerListEvent;

  static transformEvent: string = 'transform';
  static transformEndEvent: string = 'transformEnd';
  static transformStartEvent: string = 'transformStart';

  constructor(options: TransformEventOptions) {
    super(options);
    this.listEvent = options.listEvent;
  }
}
