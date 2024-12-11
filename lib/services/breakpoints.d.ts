export declare const breakpointEvent = "tyny:breakpoint";
export interface BreakpointEventArgs {
    breakpoint: Breakpoint;
    index: number;
}
export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export interface Breakpoint {
    index: number;
    name: BreakpointName;
    width: number;
}
export declare const breakpoints: Breakpoint[];
export declare function getBreakpoint(): Breakpoint;
export declare function isBreakpoint(name: BreakpointName): boolean;
export declare function isAboveBreakpoint(name: BreakpointName): boolean;
export declare function isBelowBreakpoint(name: BreakpointName): boolean;
