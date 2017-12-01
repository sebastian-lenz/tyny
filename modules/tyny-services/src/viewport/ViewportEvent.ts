import { Event, EventOptions } from 'tyny-events';

export interface ViewportEventOptions extends EventOptions {
  hasScrollbars: boolean;
  height: number;
  scrollLeft: number;
  scrollTop: number;
  width: number;
}

export default class ViewportEvent extends Event {
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
    this.hasScrollbars = options.hasScrollbars;
    this.height = options.height;
    this.scrollLeft = options.scrollLeft;
    this.scrollTop = options.scrollTop;
    this.width = options.width;
  }
}
