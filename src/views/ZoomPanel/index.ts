import { update, View, ViewOptions } from '../../core';
import { stop } from '../../fx/dispatcher';
import { WheelBehaviour } from './WheelBehaviour';
import { ZoomBehaviour } from './ZoomBehaviour';

const EPSILON = 0.0001;

export interface ZoomPanelOptions extends ViewOptions {
  enabled?: boolean;
}

export type ResizeMode = 'auto' | 'cover' | 'fit' | 'clamp' | 'none';
export type ViewProps = [number, number, number];

export abstract class ZoomPanel extends View {
  fitPadding: number = 0;
  height: number = 0;
  position: tyny.Point = { x: 0, y: 0 };
  resizeMode: ResizeMode = 'auto';
  scale: number = 1;
  width: number = 0;
  readonly wheelBehaviour: WheelBehaviour;
  readonly zoomBehaviour: ZoomBehaviour;

  constructor(options: ZoomPanelOptions) {
    super(options);

    const { enabled = true } = options;
    this.zoomBehaviour = this.addBehaviour(ZoomBehaviour, { enabled });
    this.wheelBehaviour = this.addBehaviour(WheelBehaviour, { enabled });
  }

  abstract draw(): void;

  abstract getNativeHeight(): number;

  abstract getNativeWidth(): number;

  applyViewProps([x, y, scale]: ViewProps) {
    this.scale = scale;
    this.position.x = x;
    this.position.y = y;

    stop(this);
    this.draw();
  }

  clampView() {
    const scale = this.limitScale(this.scale);
    const { x, y } = this.limitPosition(this.position, scale);

    this.applyViewProps([x, y, scale]);
  }

  coverView() {
    this.applyViewProps(this.getCoverViewProps());
  }

  isCoverView(): boolean {
    return this.matchesViewProps(this.getCoverViewProps());
  }

  isFitToView(): boolean {
    return this.matchesViewProps(this.getFitToViewProps());
  }

  fitToView() {
    this.applyViewProps(this.getFitToViewProps());
  }

  matchesViewProps([x, y, scale]: ViewProps) {
    return (
      Math.abs(this.scale - scale) < EPSILON &&
      Math.abs(this.position.x - x) < EPSILON &&
      Math.abs(this.position.y - y) < EPSILON
    );
  }

  getCenteredViewProps(scale: number): ViewProps {
    const { height, width } = this;
    const displayWidth = this.getNativeWidth() * scale;
    const displayHeight = this.getNativeHeight() * scale;

    const x = (width - displayWidth) * 0.5;
    const y = (height - displayHeight) * 0.5;

    return [x, y, scale];
  }

  getCoverViewProps(): ViewProps {
    return this.getCenteredViewProps(
      Math.max(
        this.height / this.getNativeHeight(),
        this.width / this.getNativeWidth()
      )
    );
  }

  getFitToViewProps(): ViewProps {
    const { fitPadding } = this;
    return this.getCenteredViewProps(
      Math.min(
        1,
        (this.height - fitPadding * 2) / this.getNativeHeight(),
        (this.width - fitPadding * 2) / this.getNativeWidth()
      )
    );
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
  onMeasure() {
    const { el, resizeMode } = this;
    const wasFit = resizeMode == 'auto' && this.isFitToView();
    this.height = el.offsetHeight;
    this.width = el.offsetWidth;

    switch (resizeMode) {
      case 'cover':
        return this.coverView;
      case 'fit':
        return this.fitToView;
      case 'clamp':
        return this.clampView;
      case 'auto':
        return wasFit ? this.fitToView : undefined;
    }
  }
}
