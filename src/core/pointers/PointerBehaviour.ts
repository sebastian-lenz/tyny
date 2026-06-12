import { Behaviour, BehaviourOptions } from '../Behaviour';
import { createAdapter } from './adapters';
import { event } from '../decorators';
import { Pointer, PointerOptions, PointerMoveOptions } from './Pointer';
import { Transform2D } from '../../utils/types/Transform2D';
import { Velocity } from './Velocity';

import type { AbstractAdapter } from './adapters/AbstractAdapter';
import type { View } from '../View';

const createVelocity = (): PointerBehaviourVelocity => ({
  x: 0,
  y: 0,
  rotation: 0,
  scale: 0,
});

const toVelocity = (transform: Transform2D): PointerBehaviourVelocity => ({
  x: transform.x,
  y: transform.y,
  rotation: transform.rotation,
  scale: transform.scale,
});

const length = (x: number, y: number): number => Math.sqrt(x * x + y * y);

export type NativeEvent = MouseEvent | PointerEvent | TouchEvent;

export type MaybeNativeEvent = NativeEvent | undefined;

export interface PointerBehaviourVelocity {
  [name: string]: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface PointerBehaviourOptions extends BehaviourOptions {
  target?: HTMLElement | null;
}

export class PointerBehaviour<
  TView extends View = View
> extends Behaviour<TView> {
  //
  readonly centerOffset: tyny.Point = { x: 0, y: 0 };
  readonly initialCenter: tyny.Point = { x: 0, y: 0 };
  readonly initialTransform: Transform2D = Transform2D.identity();
  readonly pointers: Pointer[] = [];
  readonly velocity = new Velocity(createVelocity);

  adapter: AbstractAdapter | null = null;

  constructor(view: TView, options: PointerBehaviourOptions = {}) {
    super(view, options);

    this.adapter = createAdapter(options.target || view.el, this);
  }

  get center(): tyny.Point {
    const { pointers } = this;
    const weight = pointers.length ? 1 / pointers.length : 0;

    return pointers.reduce(
      (result, pointer) => {
        result.x += pointer.clientX * weight;
        result.y += pointer.clientY * weight;
        return result;
      },
      { x: 0, y: 0 }
    );
  }

  /**
   * Like `center`, but stays continuous when pointers are added or
   * removed: the jump of the raw center is absorbed into `centerOffset`
   * on each commit. Use this as an anchor point for transforms.
   */
  get gestureCenter(): tyny.Point {
    const { center, centerOffset } = this;
    return {
      x: center.x + centerOffset.x,
      y: center.y + centerOffset.y,
    };
  }

  get hasPointers(): boolean {
    return !!this.pointers.length;
  }

  get transform(): Transform2D {
    const { initialCenter, initialTransform, pointers } = this;
    if (pointers.length === 0) {
      return Transform2D.identity();
    }

    if (pointers.length === 1) {
      const p = pointers[0];
      return Transform2D.translation(
        p.clientX - p.initialTransformClientX,
        p.clientY - p.initialTransformClientY
      ).multiply(initialTransform);
    }

    const center = this.center;
    let count = 0;
    let scale = 0;
    let rotate = 0;

    pointers.forEach((p) => {
      const aX = p.initialTransformClientX - initialCenter.x;
      const aY = p.initialTransformClientY - initialCenter.y;
      const bX = p.clientX - center.x;
      const bY = p.clientY - center.y;

      // Pointers too close to the center (e.g. coinciding touches)
      // carry no scale or rotation information, skip them.
      const radius = length(aX, aY);
      if (radius < 1) return;

      count += 1;
      scale += length(bX, bY) / radius;
      rotate += Math.atan2(bY, bX) - Math.atan2(aY, aX);
    });

    const result = Transform2D.translation(
      center.x - initialCenter.x,
      center.y - initialCenter.y
    ).multiply(initialTransform);

    if (count) {
      result.rotation += rotate / count;
      result.scale *= scale / count;
    }

    return result;
  }

  get usePassiveEvents(): boolean {
    return !!(this.adapter && this.adapter.usePassiveEvents);
  }

  addPointer(event: NativeEvent, options: PointerOptions) {
    const pointer = new Pointer(options);

    if (this.onAdd(event, pointer)) {
      this.commit(event, pointer, () => {
        this.pointers.push(pointer);
      });
    }
  }

  hasPointersOfAdapter(adapter: AbstractAdapter): boolean {
    return this.pointers.some((pointer) => pointer.adapter === adapter);
  }

  removePointer(event: NativeEvent | undefined, id: string) {
    const { pointers } = this;
    const index = pointers.findIndex((pointer) => pointer.id === id);

    if (index !== -1) {
      const pointer = pointers[index];
      this.onRemove(event, pointer);
      this.commit(event, pointer, () => {
        pointers.splice(index, 1);
      });
    }
  }

  removeAllPointers() {
    const { pointers } = this;
    while (pointers.length) {
      this.removePointer(undefined, pointers[0].id);
    }
  }

  movePointer(event: NativeEvent, id: string, options: PointerMoveOptions) {
    const { pointers } = this;
    const index = pointers.findIndex((pointer) => pointer.id === id);

    if (index !== -1) {
      const pointer = pointers[index];
      pointer.move(options);

      if (this.onMove(event, pointer)) {
        this.velocity.push(toVelocity(this.transform));
      } else {
        this.removePointer(event, pointer.id);
      }
    }
  }

  /**
   * Prevent all drag events from heppaning inside elements that
   * we control mouse events on. Fixes drag behviour in firefox.
   */
  @event({ name: 'dragstart' })
  onNativeDragStart(event: Event) {
    event.preventDefault();
  }

  // Behaviour API
  // -------------

  onAdd(event: NativeEvent, pointer: Pointer): boolean {
    return true;
  }

  onChanged(event: MaybeNativeEvent, pointer: Pointer): void {}

  onMove(event: NativeEvent, pointer: Pointer): boolean {
    return true;
  }

  onRemove(event: MaybeNativeEvent, pointer: Pointer): void {}

  // Private methods
  // ---------------

  onDestroyed() {
    this.removeAllPointers();
    super.onDestroyed();

    if (this.adapter) {
      this.adapter.dispose();
      this.adapter = null;
    }
  }

  commit(event: NativeEvent | undefined, pointer: Pointer, callback: Function) {
    const {
      adapter,
      centerOffset,
      initialCenter,
      initialTransform,
      pointers,
    } = this;

    const previousCenter = pointers.length ? this.center : null;
    initialTransform.copyFrom(this.transform);

    callback();

    if (pointers.length) {
      const { center } = this;
      initialCenter.x = center.x;
      initialCenter.y = center.y;

      if (previousCenter) {
        centerOffset.x += previousCenter.x - center.x;
        centerOffset.y += previousCenter.y - center.y;
      }

      pointers.forEach((pointer) => {
        pointer.initialTransformClientX = pointer.clientX;
        pointer.initialTransformClientY = pointer.clientY;
      });

      this.velocity.push(toVelocity(this.transform));
    } else {
      centerOffset.x = 0;
      centerOffset.y = 0;
      initialCenter.x = 0;
      initialCenter.y = 0;
      initialTransform.identity();

      // The transform is reset here, sampling it would create a bogus
      // velocity spike. Consumers read the velocity in onRemove, which
      // runs before this, so clearing is safe.
      this.velocity.clear();
    }

    if (adapter) {
      adapter.updateTracking();
    }

    this.onChanged(event, pointer);
  }
}
