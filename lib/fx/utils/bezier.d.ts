export interface BezierEasing {
    (value: number): number;
}
export declare function bezier(mX1: number, mY1: number, mX2: number, mY2: number): BezierEasing;
