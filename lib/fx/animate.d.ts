export interface AnimateOptions {
    duration: number;
    delay: number;
    timingFunction: string;
    fillMode: string | 'none' | 'forwards' | 'backwards' | 'both';
}
declare function animate(element: HTMLElement, name: string, options?: Partial<AnimateOptions>): Promise<void>;
declare namespace animate {
    const defaultOptions: AnimateOptions;
}
export { animate };
