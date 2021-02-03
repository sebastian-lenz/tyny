import { Event, EventOptions } from 'tyny-events';
import View from 'tyny/lib/View';

import Swap from './Swap';

export interface SwapEventOptions extends EventOptions<Swap> {
  from?: View;
  to?: View;
}

export default class SwapEvent extends Event<Swap> {
  readonly from: View | undefined;
  readonly to: View | undefined;

  static transitionEndEvent: string = 'transitionEnd';
  static transitionStartEvent: string = 'transitionStart';

  constructor(options: SwapEventOptions) {
    super(options);
    this.from = options.from;
    this.to = options.to;
  }
}