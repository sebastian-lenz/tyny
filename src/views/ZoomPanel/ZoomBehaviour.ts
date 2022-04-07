import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { momentum } from '../../fx/momentum';
import { Pointer } from '../../core/pointers/Pointer';
import { stop } from '../../fx/dispatcher';
import { TransformBehaviour } from '../../core/pointers/TransformBehaviour';
import { tween } from '../../fx/tween';
import { ZoomPanel } from './index';
import {
  MaybeNativeEvent,
  NativeEvent,
} from '../../core/pointers/PointerBehaviour';

export class ZoomBehaviour extends TransformBehaviour<ZoomPanel> {
  initialPosition: tyny.Point = { x: 0, y: 0 };
  initialScale: number = 0;
  isActive: boolean = false;

  onTransformBegin(event: NativeEvent, pointer: Pointer): boolean {
    const { view } = this;
    const {
      position: { x, y },
      scale,
    } = view;

    this.initialPosition = { x, y };
    this.initialScale = scale;
    stop(view);

    return true;
  }

  onTransform(event: MaybeNativeEvent, pointer: Pointer): boolean {
    const { center, initialPosition, initialScale, transform, view } = this;
    const { max, min } = view.getScaleBounds();
    let scale = initialScale;
    scale *= transform.scale;

    if (!isFinite(scale)) scale = initialScale;
    if (scale < min) scale = min + (scale - min) * 0.25;
    if (scale > max) scale = max + (scale - max) * 0.25;

    const { xMax, xMin, yMax, yMin } = view.getPositionBounds(scale);
    const { left, top } = view.el.getBoundingClientRect();
    let x = center.x - left;
    let y = center.y - top;
    x += ((initialPosition.x - x) / initialScale) * scale + transform.x;
    y += ((initialPosition.y - y) / initialScale) * scale + transform.y;

    if (x < xMin) x = xMin + (x - xMin) * 0.5;
    if (x > xMax) x = xMax + (x - xMax) * 0.5;
    if (y < yMin) y = yMin + (y - yMin) * 0.5;
    if (y > yMax) y = yMax + (y - yMax) * 0.5;

    view.setPosition({ x, y });
    view.setScale(scale);
    return true;
  }

  onTransformEnd(event: MaybeNativeEvent, pointer: Pointer) {
    const { view } = this;
    const { position, scale: initialScale } = view;
    const scale = view.limitScale(initialScale);

    if (this.pointers.length > 1) {
      const { left, top } = view.el.getBoundingClientRect();
      const center = this.center;
      let x = center.x - left;
      let y = center.y - top;
      x += ((position.x - x) / initialScale) * scale;
      y += ((position.y - y) / initialScale) * scale;

      tween(
        view,
        {
          position: view.limitPosition({ x, y }, scale),
          scale,
        },
        {
          easing: easeOutExpo,
        }
      );
    } else {
      const bounds = view.getPositionBounds(scale);
      const velocity = this.velocity.get();

      momentum(view, {
        position: {
          velocity: { x: velocity.x, y: velocity.y },
          max: { x: bounds.xMax, y: bounds.yMax },
          min: { x: bounds.xMin, y: bounds.yMin },
        },
      });
    }
  }
}
