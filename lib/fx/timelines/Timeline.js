import { createAccessor } from './accessors';
import { createValueType } from './valueTypes';
import { setFrameCallback } from '../dispatcher';
export class Timeline {
    constructor(options) {
        this.playState = 'playing';
        const { context, property, initialValue } = options;
        const accessor = createAccessor(context, property);
        if (!accessor) {
            throw new Error(`Could not create an accessor for the property '${property}' on '${context}'.`);
        }
        const value = accessor.getValue();
        const valueType = createValueType(value);
        if (!valueType) {
            throw new Error(`Could not resolve the value type of the property '${property}' on '${context}'.`);
        }
        this.context = context;
        this.property = property;
        this.accessor = accessor;
        this.initialValue = initialValue != null ? initialValue : value;
        this.currentValue = this.initialValue;
        this.valueType = valueType;
    }
    getCurrentValue() {
        return this.currentValue;
    }
    getPlayState() {
        return this.playState;
    }
    stop() {
        if (this.playState === 'playing') {
            this.handleStopped();
        }
    }
    handleFinished() {
        const { onFinished } = this;
        this.playState = 'finished';
        if (onFinished) {
            setFrameCallback(onFinished);
        }
    }
    handleStopped() {
        const { onStopped } = this;
        this.playState = 'stopped';
        if (onStopped)
            onStopped();
    }
}
