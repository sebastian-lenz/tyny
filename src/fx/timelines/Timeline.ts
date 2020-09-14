import { AnimationPlayState } from '../index';
import { Accessor, createAccessor } from './accessors';
import { createValueType, ValueType } from './valueTypes';
import { setFrameCallback } from '../dispatcher';

export interface TimelineOptions<TValue = any> {
  context: any;
  property: string;
  initialValue?: TValue;
}

export abstract class Timeline<TValue = any> {
  onFinished: Function | undefined;
  onStopped: Function | undefined;
  readonly accessor: Accessor;
  readonly context: any;
  readonly property: string;

  protected currentValue: TValue;
  protected initialValue: TValue;
  protected playState: AnimationPlayState = 'playing';
  protected valueType: ValueType<TValue>;

  constructor(options: TimelineOptions<TValue>) {
    const { context, property, initialValue } = options;

    const accessor = createAccessor(context, property);
    if (!accessor) {
      throw new Error(
        `Could not create an accessor for the property '${property}' on '${context}'.`
      );
    }

    const value = accessor.getValue();
    const valueType = createValueType(value);
    if (!valueType) {
      throw new Error(
        `Could not resolve the value type of the property '${property}' on '${context}'.`
      );
    }

    this.context = context;
    this.property = property;
    this.accessor = accessor;
    this.initialValue = initialValue != null ? initialValue : value;
    this.currentValue = this.initialValue;
    this.valueType = valueType;
  }

  getCurrentValue(): TValue {
    return this.currentValue;
  }

  getPlayState(): AnimationPlayState {
    return this.playState;
  }

  stop(): void {
    if (this.playState === 'playing') {
      this.handleStopped();
    }
  }

  abstract update(timeStep: number): boolean;

  protected handleFinished() {
    const { onFinished } = this;
    this.playState = 'finished';
    if (onFinished) {
      setFrameCallback(onFinished);
    }
  }

  protected handleStopped() {
    const { onStopped } = this;
    this.playState = 'stopped';
    if (onStopped) onStopped();
  }
}
