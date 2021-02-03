import { Event, EventOptions } from 'tyny-events';
import View from 'tyny/lib/View';

import Slideshow from './Slideshow';

export interface SlideshowEventOptions extends EventOptions<Slideshow> {
  from?: View;
  to?: View;
}

export default class SwapEvent extends Event<Slideshow> {
  readonly from: View | undefined;
  readonly to: View | undefined;

  static transitionDismissEvent: string = 'transitionDismiss';
  static transitionEndEvent: string = 'transitionEnd';
  static transitionStartEvent: string = 'transitionStart';

  constructor(options: SlideshowEventOptions) {
    super(options);
    this.from = options.from;
    this.to = options.to;
  }
}
