import { addFrameHook, removeFrameHook } from '../../fx/dispatcher';
import { parentsAndSelf } from '../../utils/dom/node';
import { spring } from '../../fx/spring';
import { toAxis, toDimension } from '../../core/pointers/DragBehaviour';
import { HoldBehaviour as HoldBehaviourBase, } from '../../core/pointers/HoldBehaviour';
export class HoldBehaviour extends HoldBehaviourBase {
    constructor(view, options) {
        super(view, {
            stages: [{ delay: 250 }, { delay: 1000 }, { delay: 1000 }],
        });
        this.animation = null;
        this.forward = 0;
        this.multiplier = 0;
        this.position = { x: 0, y: 0 };
        this.speed = 10;
        this.onFrame = () => {
            const { animation, forward, multiplier, speed, view } = this;
            const { direction, target } = view;
            let { position } = this;
            if (!target) {
                return;
            }
            const axis = toAxis(direction);
            position[axis] += forward * multiplier * speed;
            position = this.position = target.clampPosition(position);
            if (animation) {
                animation.advance({ position });
            }
            else {
                this.animation = spring(target, { position });
            }
        };
        if (options.onClick)
            this.onClick = options.onClick;
    }
    onBeginHold(event, _pointer) {
        const { backward, forward } = this.view;
        this.forward = parentsAndSelf(event.target).reduce((result, parent) => {
            if (parent === backward)
                return -1;
            if (parent === forward)
                return 1;
            return result;
        }, 0);
        return this.forward !== 0;
    }
    onClick(forward) {
        const { direction, target } = this.view;
        if (!target) {
            return;
        }
        const { position } = target;
        const axis = toAxis(direction);
        const dimension = toDimension(direction);
        const size = target.viewportSize[dimension];
        position[axis] = Math.round(position[axis] / size + forward) * size;
        target.tweenTo(target.clampPosition(position));
    }
    onEndHold() {
        this.animation = null;
        removeFrameHook(this.onFrame);
    }
    onStageAbort(_stage, index) {
        if (index === 0) {
            this.onClick(this.forward);
        }
    }
    onStageEnter(_stage, index) {
        if (index === 0) {
            const { target } = this.view;
            this.position = target ? target.position : { x: 0, y: 0 };
            this.multiplier = 1;
            addFrameHook(this.onFrame);
        }
        else {
            this.multiplier *= 2.5;
        }
    }
}
