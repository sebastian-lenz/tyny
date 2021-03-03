import { Pointer } from './Pointer';
import { View } from '../index';
import { MaybeNativeEvent, NativeEvent, PointerBehaviour, PointerBehaviourOptions } from './PointerBehaviour';
export interface HoldStageCallback<TStage extends HoldStage = HoldStage> {
    (stage: TStage, index: number): void;
}
export interface HoldStage {
    delay: number;
    onAbort?: HoldStageCallback<this>;
    onEnter?: HoldStageCallback<this>;
}
export interface HoldBehaviourOptions<TStage extends HoldStage = HoldStage> extends PointerBehaviourOptions {
    stages: Array<TStage>;
}
export declare class HoldBehaviour<TView extends View = View, TStage extends HoldStage = HoldStage> extends PointerBehaviour<TView> {
    currentIndex: number;
    isHolding: boolean;
    options: HoldBehaviourOptions<TStage>;
    stages: Array<TStage>;
    timeout: number | null;
    constructor(view: TView, options: HoldBehaviourOptions<TStage>);
    protected abortStage(): void;
    protected advanceStage(): boolean;
    protected finishedStage(index: number, stage: TStage): void;
    protected onAdd(event: NativeEvent, pointer: Pointer): boolean;
    protected onRemove(event: MaybeNativeEvent, pointer: Pointer): void;
    onBeginHold(event: NativeEvent, pointer: Pointer): boolean;
    onEndHold(stage: TStage | null, index: number): void;
    onStageAbort(stage: TStage, index: number): void;
    onStageEnter(stage: TStage, index: number): void;
}
