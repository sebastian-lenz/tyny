import { TransistOptions, TransistPropertyMap } from './transist';
export interface TransistWidthOptions extends Partial<TransistOptions> {
    extraProperties?: TransistPropertyMap;
    throwErrorOnSkip?: boolean;
}
export declare function transistWidth(element: HTMLElement | null | undefined, callback: Function, options?: TransistWidthOptions): Promise<void>;
