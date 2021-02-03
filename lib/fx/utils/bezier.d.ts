/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */
export interface BezierEasing {
    (value: number): number;
}
export declare function bezier(mX1: number, mY1: number, mX2: number, mY2: number): BezierEasing;
