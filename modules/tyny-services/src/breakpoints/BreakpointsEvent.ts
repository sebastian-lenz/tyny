import { Event, EventOptions } from 'tyny-events';

import { Breakpoint } from './index';

export interface BreakpointsEventOptions extends EventOptions {
  breakpoint: Breakpoint;
}

export default class BreakpointsEvent extends Event {
  readonly breakpoint: Breakpoint;

  static readonly changeEvent: string = 'change';

  constructor(options: BreakpointsEventOptions) {
    super(options);
    this.breakpoint = options.breakpoint;
  }
}
