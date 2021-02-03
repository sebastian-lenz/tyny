import { Event, EventOptions } from 'tyny-events';

import { Breakpoint } from './index';
import Breakpoints from './Breakpoints';

export interface BreakpointsEventOptions extends EventOptions<Breakpoints> {
  breakpoint: Breakpoint;
}

export default class BreakpointsEvent extends Event<Breakpoints> {
  readonly breakpoint: Breakpoint;

  static readonly changeEvent: string = 'change';

  constructor(options: BreakpointsEventOptions) {
    super(options);
    this.breakpoint = options.breakpoint;
  }
}
