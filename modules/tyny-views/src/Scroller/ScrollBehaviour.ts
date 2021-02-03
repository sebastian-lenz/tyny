import { EventEmitter, Pointer, PointerList, View } from 'tyny';
import { BoundingBoxType, PointType } from 'tyny-utils';
import { momentum, stop, tween, TweenOptions } from 'tyny-fx';
import DragBehaviour from 'tyny/lib/pointers/behaviours/DragBehaviour';
import DragEvent from 'tyny/lib/pointers/behaviours/DragEvent';
import easeOutExpo from 'tyny-fx/lib/easings/easeOutExpo';

export { DragEvent };

export interface ScrollableView extends View {
  clampPosition(value: PointType): PointType;
  getPosition(): PointType;
  getPositionBounds(): BoundingBoxType;
  isPositionPaged(): boolean;
  setPosition(value: PointType): void;
  toLocalOffset(value: PointType): PointType;
  tweenTo(value: PointType, options: Partial<TweenOptions>): void;
}

export interface ScrollBehaviourOptions {
  direction: 'horizontal' | 'vertical' | 'both';
  view: ScrollableView;
}

export default class ScrollBehaviour extends DragBehaviour {
  initialPosition: PointType;
  view: ScrollableView;

  constructor(options: ScrollBehaviourOptions) {
    super(PointerList.forView(options.view));

    const { direction, view } = options;
    this.direction = direction;
    this.initialPosition = view.getPosition();
    this.view = view;

    this.listenTo(this, DragEvent.dragStartEvent, this.handleDragStart)
      .listenTo(this, DragEvent.dragEvent, this.handleDrag)
      .listenTo(this, DragEvent.dragEndEvent, this.handleDragEnd);
  }

  private getVelocity(pointer: Pointer): PointType {
    const { direction, view } = this;
    const { clientX, clientY } = pointer.velocity.get();
    const velocity = { x: 0, y: 0 };
    if (direction !== 'vertical') {
      velocity.x = -clientX;
    }

    if (direction !== 'horizontal') {
      velocity.y = -clientY;
    }

    return view.toLocalOffset(velocity);
  }

  private handleDragStart(event: DragEvent) {
    const { view } = this;
    this.initialPosition = view.getPosition();
    stop(view);

    const { nativeEvent } = event.listEvent;
    if (nativeEvent) {
      nativeEvent.preventDefault();
    }
  }

  private handleDrag(event: DragEvent) {
    const { direction, initialPosition, view } = this;
    const { nativeEvent, pointer } = event.listEvent;

    if (nativeEvent) {
      nativeEvent.preventDefault();
    }

    const delta = view.toLocalOffset(pointer.getDelta());
    const { xMin, xMax, yMin, yMax } = view.getPositionBounds();
    let { x, y } = initialPosition;

    if (direction !== 'vertical') {
      x -= delta.x;
      if (x < xMin) x = xMin + (x - xMin) * 0.5;
      if (x > xMax) x = xMax + (x - xMax) * 0.5;
    }

    if (direction !== 'horizontal') {
      y -= delta.y;
      if (y < yMin) y = yMin + (y - yMin) * 0.5;
      if (y > yMax) y = yMax + (y - yMax) * 0.5;
    }

    view.setPosition({ x, y });
  }

  private handleDragEnd(event: DragEvent) {
    const { direction, view } = this;
    const { pointer } = event.listEvent;
    const position = view.getPosition();
    const velocity = this.getVelocity(pointer);

    if (view.isPositionPaged()) {
      const position = view.getPosition();
      position.x += velocity.x * 10;
      position.y += velocity.y * 10;
      view.tweenTo(view.clampPosition(position), { easing: easeOutExpo });
    } else {
      const { xMin, xMax, yMin, yMax } = view.getPositionBounds();

      momentum(view, {
        position: {
          velocity,
          min: { x: xMin, y: yMin },
          max: { x: xMax, y: yMax },
        },
      });
    }
  }
}
