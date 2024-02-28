import { Behaviour, BehaviourOptions } from '../../core/Behaviour';
import type { FilterableView, FilterableViewParams } from './index';
import type { Modifier, SyncOptions } from './Modifier';
export interface BehaviourModifierOptions extends BehaviourOptions {
}
export declare abstract class BehaviourModifier<TView extends FilterableView = FilterableView> extends Behaviour<TView> implements Modifier {
    constructor(view: TView, options?: BehaviourModifierOptions);
    softReset(): void;
    abstract getParams(): FilterableViewParams;
    abstract sync(options: SyncOptions): boolean;
}
