import { update, View, ViewOptions } from '../../core';
import { stop } from '../../fx/dispatcher';
import { WheelBehaviour } from './WheelBehaviour';
import { ZoomBehaviour } from './ZoomBehaviour';

export interface ZoomPanelOptions extends ViewOptions {}

export abstract class ZoomPanel extends View {
  fitPadding: number = 0;
  height: number = 0;
  position: tyny.Point = { x: 0, y: 0 };
  scale: number = 1;
  width: number = 0;
  readonly wheelBehaviour: WheelBehaviour;
  readonly zoomBehaviour: ZoomBehaviour;

  constructor(options: ZoomPanelOptions) {
    super(options);

    this.zoomBehaviour = this.addBehaviour(ZoomBehaviour);
    this.wheelBehaviour = this.addBehaviour(WheelBehaviour);
  }

  abstract draw(): void;

  abstract getNativeHeight(): number;

  abstract getNativeWidth(): number;

  fitToView() {
    const { height, fitPadding, width } = this;
    const nativeHeight = this.getNativeHeight();
    const nativeWidth = this.getNativeWidth();
    const scale = Math.min(
      1,
      (height - fitPadding * 2) / nativeHeight,
      (width - fitPadding * 2) / nativeWidth
    );

    const displayWidth = nativeWidth * scale;
    const displayHeight = nativeHeight * scale;
    const x = (width - displayWidth) * 0.5;
    const y = (height - displayHeight) * 0.5;

    stop(this);
    this.setPosition({ x, y });
    this.setScale(scale);
  }

  getPositionBounds(scale: number = this.scale): tyny.BoundingBox {
    const { height, width } = this;
    const nativeHeight = this.getNativeHeight();
    const nativeWidth = this.getNativeWidth();
    const displayWidth = nativeWidth * scale;
    const displayHeight = nativeHeight * scale;
    const x = (width - displayWidth) * 0.5;
    const y = (height - displayHeight) * 0.5;

    return {
      xMax: Math.max(x, 0),
      xMin: Math.min(x, width - displayWidth),
      yMax: Math.max(y, 0),
      yMin: Math.min(y, height - displayHeight),
    };
  }

  getScaleBounds(): tyny.Interval {
    const { height, fitPadding: padding, width } = this;
    const nativeHeight = this.getNativeHeight();
    const nativeWidth = this.getNativeWidth();
    const scale = Math.min(
      1,
      (height - padding * 2) / nativeHeight,
      (width - padding * 2) / nativeWidth
    );

    return {
      min: scale,
      max: 1,
    };
  }

  limitPosition({ x, y }: tyny.Point, scale: number = this.scale): tyny.Point {
    const { xMax, xMin, yMin, yMax } = this.getPositionBounds(scale);
    if (x < xMin) x = xMin;
    if (x > xMax) x = xMax;
    if (y < yMin) y = yMin;
    if (y > yMax) y = yMax;

    return { x, y };
  }

  limitScale(scale: number): number {
    const { max, min } = this.getScaleBounds();
    if (scale < min) scale = min;
    if (scale > max) scale = max;

    return scale;
  }

  setPosition({ x, y }: tyny.Point) {
    const { position } = this;
    if (position.x === x && position.y === y) return;

    position.x = x;
    position.y = y;
    this.draw();
  }

  setScale(value: number) {
    if (this.scale === value) return;
    this.scale = value;
    this.draw();
  }

  @update({ events: 'resize', mode: 'read' })
  protected onMeasure() {
    const { el } = this;
    this.height = el.offsetHeight;
    this.width = el.offsetWidth;

    return () => {
      this.fitToView();
    };
  }
}
