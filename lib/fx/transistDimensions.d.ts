import { TransistOptions, TransistPropertyMap } from './transist';
export interface TransistDimensionsOptions extends Partial<TransistOptions> {
    extraProperties?: TransistPropertyMap;
    throwErrorOnSkip?: boolean;
    transistHeight?: boolean;
    transistWidth?: boolean;
}
export declare function transistDimensions(element: HTMLElement | null | undefined, callback: Function, options: TransistDimensionsOptions): Promise<void>;