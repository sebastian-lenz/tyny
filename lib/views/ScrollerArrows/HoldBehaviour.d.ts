import { NativeEvent } from '../../core/pointers/PointerBehaviour';
import { Pointer } from '../../core/pointers/Pointer';
import { ScrollerArrows } from './index';
import { Spring } from '../../fx/spring';
import { HoldBehaviour as HoldBehaviourBase, HoldStage } from '../../core/pointers/HoldBehaviour';
export declare class HoldBehaviour extends HoldBehaviourBase<ScrollerArrows> {
    animation: Spring | null;
    forward: number;
    multiplier: number;
    position: tyny.Point;
    speed: number;
    constructor(view: ScrollerArrows);
    onBeginHold(event: NativeEvent, _pointer: Pointer): boolean;
    onEndHold(): void;
    onFrame: () => void;
    onStageAbort(_stage: HoldStage, index: number): void;
    onStageEnter(_stage: HoldStage, index: number): void;
}