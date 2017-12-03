import { EventEmitter } from 'tyny-events';

import { viewport, ViewportEvent } from '../viewport';

import { Breakpoint } from './index';
import BreakpointsEvent from './BreakpointsEvent';
import defaultBreakpoints from './defaultBreakpoints';

export default class Breakpoints extends EventEmitter {
  breakpoints: Breakpoint[] = defaultBreakpoints();
  current: Breakpoint;
  currentIndex: number = 0;
  getDeviceWidth: { (): number };
  getDeviceHeight: { (): number };

  constructor() {
    super();

    let scope: any = window;
    let prefix = 'inner';
    if (!('innerWidth' in window)) {
      prefix = 'client';
      scope = document.documentElement || document.body;
    }

    this.getDeviceWidth = () => scope[prefix + 'Width'];
    this.getDeviceHeight = () => scope[prefix + 'Height'];
    this.listenTo(
      viewport(),
      ViewportEvent.resizeEvent,
      this.handleViewportResize,
      10
    );

    this.update();
  }

  setBreakpoints(value: Breakpoint[]) {
    this.breakpoints = value;
    this.update();
  }

  update() {
    const { breakpoints } = this;
    const { width: viewportWidth } = viewport();
    const deviceWidth = this.getDeviceWidth();
    const length = breakpoints.length;

    let index = 0;
    while (index < length - 1) {
      if (breakpoints[index + 1].minWidth > deviceWidth) {
        break;
      } else {
        index += 1;
      }
    }

    const breakpoint = breakpoints[index];
    if (breakpoint.update) {
      breakpoint.update(breakpoint, viewportWidth);
    }

    if (this.currentIndex != index || breakpoint.update) {
      this.current = breakpoint;
      this.currentIndex = index;
      this.emit(
        new BreakpointsEvent({
          breakpoint,
          type: BreakpointsEvent.changeEvent,
        })
      );
    }
  }

  protected handleViewportResize() {
    this.update();
  }
}
