import { PointType } from 'tyny-utils/lib/types/Point';

import Adapter from './adapters/Adapter';
import Velocity from './Velocity';

export type PointerType = 'mouse' | 'touch' | 'pen';

export interface PointerOptions {
  adapter: Adapter;
  clientX: number;
  clientY: number;
  id: string;
  type: PointerType;
}

export interface PointerUpdateOptions {
  clientX: number;
  clientY: number;
}

export interface PointerVelocity {
  [name: string]: number;
  clientX: number;
  clientY: number;
}

const createVelocity = (): PointerVelocity => ({
  clientX: 0,
  clientY: 0,
});

export default class Pointer {
  adapter: Adapter;
  clientX: number;
  clientY: number;
  id: string;
  initialClientX: number;
  initialClientY: number;
  initialTransformClientX: number;
  initialTransformClientY: number;
  lastClientX: number;
  lastClientY: number;
  type: PointerType;
  velocity: Velocity<PointerVelocity>;

  constructor(options: PointerOptions) {
    const { clientX, clientY } = options;

    this.adapter = options.adapter;
    this.clientX = clientX;
    this.clientY = clientY;
    this.id = options.id;
    this.initialClientX = clientX;
    this.initialClientY = clientY;
    this.initialTransformClientX = clientX;
    this.initialTransformClientY = clientY;
    this.lastClientX = clientX;
    this.lastClientY = clientY;
    this.type = options.type;
    this.velocity = new Velocity(createVelocity);
    this.velocity.push({ clientX, clientY });
  }

  getDelta(): PointType {
    return {
      x: this.clientX - this.initialClientX,
      y: this.clientY - this.initialClientY,
    };
  }

  getDeltaLength(): number {
    const { x, y } = this.getDelta();
    return Math.sqrt(x * x + y * y);
  }

  resetInitialPosition() {
    this.initialClientX = this.clientX;
    this.initialClientY = this.clientY;
  }

  update(options: PointerUpdateOptions) {
    const { clientX, clientY } = options;

    this.lastClientX = this.clientX;
    this.lastClientY = this.clientY;
    this.clientX = clientX;
    this.clientY = clientY;
    this.velocity.push({ clientX, clientY });
  }
}
