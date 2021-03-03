import { PointerBehaviour, } from './PointerBehaviour';
export class HoldBehaviour extends PointerBehaviour {
    constructor(view, options) {
        super(view, options);
        //
        this.currentIndex = -1;
        this.isHolding = false;
        this.timeout = null;
        this.options = options;
        this.stages = options.stages;
    }
    abortStage() {
        const { currentIndex, stages, timeout } = this;
        if (timeout) {
            this.onStageAbort(stages[currentIndex], currentIndex);
            clearTimeout(timeout);
        }
        this.currentIndex = -1;
        this.timeout = null;
    }
    advanceStage() {
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
    finishedStage(index, stage) {
        this.onStageEnter(stage, index);
        this.advanceStage();
    }
    onAdd(event, pointer) {
        if (this.isHolding || !this.onBeginHold(event, pointer)) {
            return false;
        }
        this.isHolding = true;
        this.advanceStage();
        return true;
    }
    onRemove(event, pointer) {
        const { currentIndex, stages } = this;
        this.isHolding = false;
        this.abortStage();
        this.onEndHold(stages[currentIndex] || null, currentIndex);
    }
    // API
    // ---
    onBeginHold(event, pointer) {
        return true;
    }
    onEndHold(stage, index) { }
    onStageAbort(stage, index) {
        if (stage.onAbort)
            stage.onAbort(stage, index);
    }
    onStageEnter(stage, index) {
        if (stage.onEnter)
            stage.onEnter(stage, index);
    }
}
