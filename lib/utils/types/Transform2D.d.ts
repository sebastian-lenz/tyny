export interface Transform2DType {
    x: number;
    y: number;
    rotation: number;
    scale: number;
}
export declare class Transform2D implements Transform2DType {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    constructor(x?: number, y?: number, scale?: number, rotation?: number);
    multiply(other: Transform2DType): this;
    clone(): Transform2D;
    copyFrom(other: Transform2DType): void;
    identity(): void;
    translate(x: number, y: number): this;
    static identity(): Transform2D;
    static multiply(a: Transform2DType, b: Transform2DType, out?: Transform2D): Transform2D;
    static translation(x: number, y: number): Transform2D;
}
