import { CycleableView } from '../CycleableView';
import { AbstractNumeration, AbstractNumerationOptions } from './AbstractNumeration';
export declare const numerationChangeEvent = "tyny:numerationChange";
export interface NumerationEventArgs {
    index: number;
    target: Numeration;
}
export interface NumerationOptions extends AbstractNumerationOptions {
    ignoreUndecided?: boolean;
}
export declare class Numeration extends AbstractNumeration {
    ignoreUndecided?: boolean;
    private _targetListeners;
    get target(): CycleableView | null;
    constructor(options?: NumerationOptions);
    protected onCurrentChanged(): void;
    protected onLengthChanged(): void;
    protected onTargetChanged(target: CycleableView | null): void;
    protected selectIndex(index: number): void;
}
