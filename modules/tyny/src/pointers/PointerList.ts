import { EventEmitter } from 'tyny-events';
import { Point, SimpleTransform } from 'tyny-utils';

import Pointer, { PointerOptions, PointerUpdateOptions } from './Pointer';
import PointerListEvent from './PointerListEvent';
import Velocity from './Velocity';
import View from '../View';

import createAdapter, { Adapter } from './adapters';

export type NativeEvent = MouseEvent | PointerEvent | TouchEvent;

export interface PointerListVelocity {
  [name: string]: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

const createVelocity = (): PointerListVelocity => ({
  x: 0,
  y: 0,
  rotation: 0,
  scale: 0,
});

const toVelocity = (transform: SimpleTransform): PointerListVelocity => ({
  x: transform.x,
  y: transform.y,
  rotation: transform.rotation,
  scale: transform.scale,
});

/**
 * @event 'add' (event: PreventablePointerEvent): void
 * @event 'commit' (event: PointerEvent): void
 * @event 'remove' (event: PointerEvent): void
 * @event 'update' (event: PreventablePointerEvent): void
 */
export default class PointerList extends EventEmitter {
  initialCenter: Point = Point.origin();
  initialTransform: SimpleTransform = SimpleTransform.identity();
  pointers: Pointer[] = [];
  velocity: Velocity<PointerListVelocity> = new Velocity(createVelocity);

  private _adapter: Adapter | undefined;

  constructor(element: HTMLElement) {
    super();
    this._adapter = createAdapter(element, this);
  }

  /**
   * Try to add a new pointer to this list.
   *
   * Triggers the 'add' event which can be prevented in which case
   * the pointer will not be added to this list.
   */
  add(event: NativeEvent, options: PointerOptions) {
    const { pointers, velocity } = this;
    const pointer = new Pointer(options);
    const isPrevented = this.emitPointerListEvent(
      PointerListEvent.addEvent,
      pointer,
      event
    );

    if (!isPrevented) {
      this.commit(event, pointer, () => {
        pointers.push(pointer);
      });
    }
  }

  /**
   * Dispose this pointer list.
   */
  dispose() {
    const { _adapter } = this;
    if (_adapter) {
      _adapter.dispose();
      this._adapter = undefined;
    }
  }

  /**
   * Return the current center point of this list.
   */
  getCenter(): Point {
    const { pointers } = this;
    const weight = pointers.length ? 1 / pointers.length : 0;
    const origin = new Point();

    return this.pointers.reduce(
      (result, pointer) =>
        result.add(pointer.clientX * weight, pointer.clientY * weight),
      origin
    );
  }

  /**
   * Return the current transform.
   */
  getTransform(): SimpleTransform {
    const { initialCenter, initialTransform, pointers } = this;
    if (pointers.length === 0) {
      return SimpleTransform.identity();
    }

    if (pointers.length === 1) {
      const pointer = pointers[0];
      return SimpleTransform.translation(
        pointer.clientX - pointer.initialTransformClientX,
        pointer.clientY - pointer.initialTransformClientY
      ).multiply(initialTransform);
    }

    const center = this.getCenter();
    const weight = 1 / pointers.length;
    let scale = 0;
    let rotate = 0;
    pointers.forEach(pointer => {
      const a = new Point(
        pointer.initialTransformClientX - initialCenter.x,
        pointer.initialTransformClientY - initialCenter.y
      );

      const b = new Point(
        pointer.clientX - center.x,
        pointer.clientY - center.y
      );

      scale += (b.length() / a.length()) * weight;
      rotate += (b.rotation() - a.rotation()) * weight;
    });

    const result = SimpleTransform.translation(
      center.x - initialCenter.x,
      center.y - initialCenter.y
    ).multiply(initialTransform);

    result.rotation += rotate;
    result.scale *= scale;
    return result;
  }

  /**
   * Returns whether there are any pointers in this list.
   */
  hasPointers(): boolean {
    return !!this.pointers.length;
  }

  /**
   * Returns whether there are any pointers of the given adapter
   * in this list.
   */
  hasPointersOfAdapter(adapter: Adapter): boolean {
    return this.pointers.some(pointer => pointer.adapter === adapter);
  }

  /**
   * Removes the pointer with the given id from this list.
   *
   * Triggers the 'remove' event.
   */
  remove(event: NativeEvent | undefined, id: string) {
    const { pointers } = this;
    const index = pointers.findIndex(pointer => pointer.id === id);

    if (index !== -1) {
      const pointer = pointers[index];
      this.emitPointerListEvent(PointerListEvent.removeEvent, pointer, event);
      this.commit(event, pointer, () => {
        pointers.splice(index, 1);
      });
    }
  }

  /**
   * Removes all pointers from this list.
   */
  removeAll() {
    const { pointers } = this;
    while (pointers.length) {
      this.remove(undefined, pointers[0].id);
    }
  }

  /**
   * Updates the pointer with the given id.
   *
   * Triggers the 'update' event which can be prevented in which case
   * the pointer will not removed from this list.
   */
  update(event: NativeEvent, id: string, options: PointerUpdateOptions) {
    const { pointers } = this;
    const index = pointers.findIndex(pointer => pointer.id === id);

    if (index !== -1) {
      const pointer = pointers[index];
      pointer.update(options);

      const isPrevented = this.emitPointerListEvent(
        PointerListEvent.updateEvent,
        pointer,
        event
      );

      if (isPrevented) {
        this.remove(event, pointer.id);
      } else {
        this.velocity.push(toVelocity(this.getTransform()));
      }
    }
  }

  /**
   * Triggers a preventable event on this list.
   */
  protected emitPointerListEvent(
    type: string,
    pointer: Pointer,
    nativeEvent?: NativeEvent
  ): boolean {
    const event = new PointerListEvent({
      nativeEvent,
      pointer,
      target: this,
      type,
    });

    this.emit(event);
    return event.isDefaultPrevented();
  }

  /**
   *
   */
  protected commit(
    event: NativeEvent | undefined,
    pointer: Pointer,
    callback: Function
  ) {
    const { initialCenter, initialTransform, pointers, velocity } = this;
    initialTransform.copyFrom(this.getTransform());

    callback();

    if (pointers.length) {
      initialCenter.copyFrom(this.getCenter());
      pointers.forEach(pointer => {
        pointer.initialTransformClientX = pointer.clientX;
        pointer.initialTransformClientY = pointer.clientY;
      });
    } else {
      initialCenter.origin();
      initialTransform.identity();
    }

    velocity.push(toVelocity(this.getTransform()));
    this.emitPointerListEvent(PointerListEvent.commitEvent, pointer, event);
  }

  static forView(view: View): PointerList {
    let { _pointerList } = <any>view;
    if (!_pointerList) {
      _pointerList = new PointerList(view.element);
      (<any>view)._pointerList = _pointerList;
    }

    return _pointerList;
  }
}
