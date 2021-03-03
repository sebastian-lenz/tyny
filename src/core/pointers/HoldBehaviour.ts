import { Pointer } from './Pointer';
import { View } from '../index';
import {
  MaybeNativeEvent,
  NativeEvent,
  PointerBehaviour,
  PointerBehaviourOptions,
} from './PointerBehaviour';

export interface HoldStageCallback<TStage extends HoldStage = HoldStage> {
  (stage: TStage, index: number): void;
}

export interface HoldStage {
  delay: number;
  onAbort?: HoldStageCallback<this>;
  onEnter?: HoldStageCallback<this>;
}

export interface HoldBehaviourOptions<TStage extends HoldStage = HoldStage>
  extends PointerBehaviourOptions {
  stages: Array<TStage>;
}

export class HoldBehaviour<
  TView extends View = View,
  TStage extends HoldStage = HoldStage
> extends PointerBehaviour<TView> {
  //
  currentIndex: number = -1;
  isHolding = false;
  options: HoldBehaviourOptions<TStage>;
  stages: Array<TStage>;
  timeout: number | null = null;

  constructor(view: TView, options: HoldBehaviourOptions<TStage>) {
    super(view, options);

    this.options = options;
    this.stages = options.stages;
  }

  protected abortStage() {
    const { currentIndex, stages, timeout } = this;
    if (timeout) {
      this.onStageAbort(stages[currentIndex], currentIndex);
      clearTimeout(timeout);
    }

    this.currentIndex = -1;
    this.timeout = null;
  }

  protected advanceStage(): boolean {
    const { currentIndex, stages } = this;
    const index = currentIndex + 1;
    if (index >= stages.length || this.timeout) {
      return false;
    }

    const stage = stages[index];
    this.currentIndex = index;
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.finishedStage(index, stage);
    }, stage.delay);

    return true;
  }

  protected finishedStage(index: number, stage: TStage) {
    this.onStageEnter(stage, index);
    this.advanceStage();
  }

  protected onAdd(event: NativeEvent, pointer: Pointer): boolean {
    if (this.isHolding || !this.onBeginHold(event, pointer)) {
      return false;
    }

    this.isHolding = true;
    this.advanceStage();
    return true;
  }

  protected onRemove(event: MaybeNativeEvent, pointer: Pointer): void {
    const { currentIndex, stages } = this;

    this.isHolding = false;
    this.abortStage();
    this.onEndHold(stages[currentIndex] || null, currentIndex);
  }

  // API
  // ---

  onBeginHold(event: NativeEvent, pointer: Pointer): boolean {
    return true;
  }

  onEndHold(stage: TStage | null, index: number) {}

  onStageAbort(stage: TStage, index: number) {
    if (stage.onAbort) stage.onAbort(stage, index);
  }

  onStageEnter(stage: TStage, index: number) {
    if (stage.onEnter) stage.onEnter(stage, index);
  }
}
