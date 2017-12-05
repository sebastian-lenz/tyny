import { Event, EventOptions } from 'tyny-events';
import View from 'tyny/lib/View';

import Swap from './Swap';

export interface SwapEventOptions extends EventOptions {
  from?: View;
  target: Swap;
  to?: View;
}

export default class SwapEvent extends Event {
  readonly from: View | undefined;
  readonly target: Swap;
  readonly to: View | undefined;

  static transitionEndEvent: string = 'transitionEnd';
  static transitionStartEvent: string = 'transitionStart';

  constructor(options: SwapEventOptions) {
    super(options);
    this.from = options.from;
    this.to = options.to;
  }
}
