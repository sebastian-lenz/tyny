import { AbstractAdapter } from './adapters/AbstractAdapter';
import { Velocity } from './Velocity';

const createVelocity = (): PointerVelocity => ({
  clientX: 0,
  clientY: 0,
});

export type PointerType = 'mouse' | 'touch' | 'pen';

export interface PointerOptions {
  adapter: AbstractAdapter;
  clientX: number;
  clientY: number;
  id: string;
  type: PointerType;
}

export interface PointerMoveOptions {
  clientX: number;
  clientY: number;
}

export interface PointerVelocity {
  [name: string]: number;
  clientX: number;
  clientY: number;
}

export class Pointer {
  clientX: number;
  clientY: number;
  initialClientX: number;
  initialClientY: number;
  initialTransformClientX: number;
  initialTransformClientY: number;
  lastClientX: number;
  lastClientY: number;
  velocity: Velocity<PointerVelocity>;
  readonly adapter: AbstractAdapter;
  readonly id: string;
  readonly type: PointerType;

  get delta(): tyny.Point {
    return {
      x: this.clientX - this.initialClientX,
      y: this.clientY - this.initialClientY,
    };
  }

  get deltaLength(): number {
    const { x, y } = this.delta;
    return Math.sqrt(x * x + y * y);
  }

  constructor(options: PointerOptions) {
    const { clientX, clientY } = options;

    this.id = options.id;
    this.adapter = options.adapter;
    this.type = options.type;

    this.clientX =
      this.initialClientX =
      this.initialTransformClientX =
      this.lastClientX =
        clientX;

    this.clientY =
      this.initialClientY =
      this.initialTransformClientY =
      this.lastClientY =
        clientY;

    this.velocity = new Velocity(createVelocity);
    this.velocity.push({ clientX, clientY });
  }

  getVelocity(): tyny.Point {
    const { clientX, clientY } = this.velocity.get();
    return { x: clientX, y: clientY };
  }

  move({ clientX, clientY }: PointerMoveOptions) {
    this.lastClientX = this.clientX;
    this.lastClientY = this.clientY;
    this.clientX = clientX;
    this.clientY = clientY;
    this.velocity.push({ clientX, clientY });
  }

  resetInitialPosition() {
    this.initialClientX = this.clientX;
    this.initialClientY = this.clientY;
  }
}
