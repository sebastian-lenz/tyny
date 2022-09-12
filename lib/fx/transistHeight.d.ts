import { TransistOptions, TransistPropertyMap } from './transist';
export interface TransistHeightOptions extends Partial<TransistOptions> {
    extraProperties?: TransistPropertyMap;
    throwErrorOnSkip?: boolean;
}
export declare function transistHeight(element: HTMLElement | null | undefined, callback: Function, options?: TransistHeightOptions): Promise<void>;
