import { Event, EventOptions } from 'tyny-events';

import Viewport from './Viewport';

export interface ViewportEventOptions extends EventOptions<Viewport> {}

export default class ViewportEvent extends Event<Viewport> {
  readonly hasScrollbars: boolean;
  readonly height: number;
  readonly scrollLeft: number;
  readonly scrollTop: number;
  readonly width: number;

  static readonly resizeEvent: string = 'resize';
  static readonly scrollbarsEvent: string = 'scrollbars';
  static readonly scrollEvent: string = 'scroll';

  constructor(options: ViewportEventOptions) {
    super(options);

    const { target } = options;
    this.hasScrollbars = target.hasScrollbars();
    this.height = target.height;
    this.scrollLeft = target.scrollLeft;
    this.scrollTop = target.scrollTop;
    this.width = target.width;
  }
}
