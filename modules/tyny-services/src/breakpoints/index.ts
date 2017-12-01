import Breakpoints from './Breakpoints';
import BreakpointsEvent from './BreakpointsEvent';

export interface Breakpoint {
  containerWidth: number;
  minWidth: number;
  name: string;
  update?: { (breakpoint: Breakpoint, width: number): void };
}

export { BreakpointsEvent };
export default new Breakpoints();
