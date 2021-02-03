export interface VelocityData {
    [name: string]: number;
}
export interface VelocitySample<T extends VelocityData> {
    time: number;
    data: T;
}
export interface VelocityFactory<T> {
    (): T;
}
export declare class Velocity<T extends VelocityData> {
    trackingPeriod: number;
    protected factory: VelocityFactory<T>;
    protected samples: VelocitySample<T>[];
    constructor(factory: VelocityFactory<T>);
    get(): T;
    push(data: T): void;
    revise(): void;
}
