export declare type FillMode = 'none' | 'forwards' | 'backwards' | 'both';
export declare type Direction = 'inherit' | 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
export interface AnimateOptions {
    delay: number;
    direction: Direction;
    duration: number;
    fillMode: FillMode;
    timingFunction: string;
}
declare function animate(element: HTMLElement, name: string, options?: Partial<AnimateOptions>): Promise<void>;
declare namespace animate {
    const defaultOptions: AnimateOptions;
}
export { animate };
