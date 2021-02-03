import { EasingFunction } from './index';
export interface TransistOptions {
    delay: number;
    duration: number;
    timingFunction: string | EasingFunction;
}
export interface TransistProperty {
    clear?: boolean;
    duration?: number;
    delay?: number;
    from?: string;
    timingFunction?: string | EasingFunction;
    to: string;
}
export interface TransistPropertyMap {
    [name: string]: string | TransistProperty;
}
declare function transist(element: HTMLElement, properties: TransistPropertyMap, options?: Partial<TransistOptions>): Promise<void>;
declare namespace transist {
    const defaultOptions: TransistOptions;
}
export { transist };
