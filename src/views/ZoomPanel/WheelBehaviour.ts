import { Behaviour, BehaviourOptions } from '../../core/Behaviour';
import { event } from '../../core';
import { normalizeWheel } from '../../utils/env/normalizeWheel';
import { onWheel } from '../../utils/env';
import { spring } from '../../fx/spring';
import { ZoomPanel } from './index';

export interface WheelBehaviourOptions extends BehaviourOptions {
  enabled?: boolean;
}

export class WheelBehaviour extends Behaviour<ZoomPanel> {
  enabled: boolean;
  power: number = 1;
  requireCtrlKey: boolean = false;

  constructor(view: ZoomPanel, options: WheelBehaviourOptions = {}) {
    super(view, options);

    const { enabled = true } = options;
    this.enabled = enabled;
  }

  @event({ name: onWheel })
  handleWheel(event: WheelEvent) {
    if (!this.enabled) {
      return;
    }

    if (this.requireCtrlKey && !this.hasCtrlKey(event)) {
      this.onCtrlAbort();
      return;
    }

    event.preventDefault();

    const data = normalizeWheel(event);
    const { view } = this;
    const {
      position: { x: currentX, y: currentY },
      scale: currentScale,
    } = view;

    let scale = currentScale;
    if (data.spinY < -0.01) {
      scale /= 1 - data.spinY * this.power;
    } else if (data.spinY > 0.01) {
      scale *= 1 + data.spinY * this.power;
    }

    scale = view.limitScale(scale);
    if (Math.abs(currentScale - scale) < 0.0001) {
      return;
    }

    const { left, top } = view.el.getBoundingClientRect();
    let x = event.clientX - left;
    let y = event.clientY - top;
    x += ((currentX - x) / currentScale) * scale;
    y += ((currentY - y) / currentScale) * scale;

    spring(
      view,
      {
        position: view.limitPosition({ x, y }, scale),
        scale,
      },
      {
        epsilon: 0.00001,
      }
    );
  }

  hasCtrlKey(event: WheelEvent) {
    return event.ctrlKey || event.metaKey;
  }

  onCtrlAbort() {}
}
