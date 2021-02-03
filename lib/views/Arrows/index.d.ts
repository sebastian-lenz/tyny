import { CycleableView } from '../CycleableView';
import { View, ViewOptions } from '../../core';
export interface ArrowsOptions extends ViewOptions {
    target?: CycleableView | string;
}
export declare class Arrows extends View {
    protected stopListening: Function[] | null;
    backward: HTMLButtonElement;
    forward: HTMLButtonElement;
    get target(): CycleableView | null;
    protected navigateBy(step: number): void;
    protected onChanged(): void;
    protected onClick(event: tyny.DelegateEvent): void;
    protected onTargetChanged(): void;
    protected onTransist(): void;
}
