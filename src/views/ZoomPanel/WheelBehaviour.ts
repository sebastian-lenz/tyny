import { Behaviour } from '../../core/Behaviour';
import { event } from '../../core';
import { normalizeWheel } from '../../utils/env/normalizeWheel';
import { onWheel } from '../../utils/env';
import { spring } from '../../fx/spring';
import { ZoomPanel } from './index';

const power = 1;

export class WheelBehaviour extends Behaviour<ZoomPanel> {
  @event({ name: onWheel })
  handleWheel(event: WheelEvent) {
    const data = normalizeWheel(event);
    const { view } = this;
    const {
      position: { x: currentX, y: currentY },
      scale: currentScale,
    } = view;

    let scale = currentScale;
    if (data.spinY < -0.01) {
      scale /= 1 - data.spinY * power;
    } else if (data.spinY > 0.01) {
      scale *= 1 + data.spinY * power;
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
        epsilon: 0.0001,
      }
    );
  }
}
