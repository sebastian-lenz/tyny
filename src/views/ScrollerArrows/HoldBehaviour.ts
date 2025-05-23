import { addFrameHook, removeFrameHook } from '../../fx/dispatcher';
import { get } from '../../utils/lang/object/get';
import { NativeEvent } from '../../core/pointers/PointerBehaviour';
import { Pointer } from '../../core/pointers/Pointer';
import { parentsAndSelf } from '../../utils/dom/node';
import { ScrollerArrows } from './index';
import { Spring, spring } from '../../fx/spring';
import { toAxis, toDimension } from '../../core/pointers/DragBehaviour';
import {
  HoldBehaviour as HoldBehaviourBase,
  HoldStage,
} from '../../core/pointers/HoldBehaviour';

export interface HoldBehaviourOptions {
  onClick?: (forward: number) => void;
  speed?: number;
}

export class HoldBehaviour extends HoldBehaviourBase<ScrollerArrows> {
  animation: Spring | null = null;
  forward: number = 0;
  multiplier: number = 0;
  position: tyny.Point = { x: 0, y: 0 };
  speed: number = 10;

  constructor(view: ScrollerArrows, options: HoldBehaviourOptions) {
    super(view, {
      stages: [{ delay: 250 }, { delay: 1000 }, { delay: 1000 }],
    });

    this.speed = get<number>(options, 'speed', 10);

    if (options.onClick) {
      this.onClick = options.onClick;
    }
  }

  onBeginHold(event: NativeEvent, _pointer: Pointer): boolean {
    const { backward, forward } = this.view;
    this.forward = parentsAndSelf(event.target).reduce((result, parent) => {
      if (parent === backward) return -1;
      if (parent === forward) return 1;
      return result;
    }, 0);

    return this.forward !== 0;
  }

  onClick(forward: number) {
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

  onFrame = () => {
    const { animation, forward, multiplier, speed, view } = this;
    const { direction, target } = view;
    let { position } = this;
    if (!target || !speed) {
      return;
    }

    const axis = toAxis(direction);
    position[axis] += forward * multiplier * speed;
    position = this.position = target.clampPosition(position);

    if (animation) {
      animation.advance({ position });
    } else {
      this.animation = spring(target, { position });
    }
  };

  onStageAbort(_stage: HoldStage, index: number) {
    if (index === 0) {
      this.onClick(this.forward);
    }
  }

  onStageEnter(_stage: HoldStage, index: number) {
    if (index === 0) {
      const { target } = this.view;
      this.position = target ? target.position : { x: 0, y: 0 };
      this.multiplier = 1;
      addFrameHook(this.onFrame);
    } else {
      this.multiplier *= 2.5;
    }
  }
}
