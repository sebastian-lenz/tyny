import { memoize } from 'tyny-utils';

import Breakpoints from './Breakpoints';
import BreakpointsEvent from './BreakpointsEvent';

export { BreakpointsEvent };

export interface Breakpoint {
  containerWidth: number;
  minWidth: number;
  name: string;
  update?: { (breakpoint: Breakpoint, width: number): void };
}

export const breakpoints = memoize(function breakpoints() {
  return new Breakpoints();
});
