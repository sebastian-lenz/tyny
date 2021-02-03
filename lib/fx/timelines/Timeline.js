import { createAccessor } from './accessors';
import { createValueType } from './valueTypes';
import { setFrameCallback } from '../dispatcher';
var Timeline = /** @class */ (function () {
    function Timeline(options) {
        this.playState = 'playing';
        var context = options.context, property = options.property, initialValue = options.initialValue;
        var accessor = createAccessor(context, property);
        if (!accessor) {
            throw new Error("Could not create an accessor for the property '" + property + "' on '" + context + "'.");
        }
        var value = accessor.getValue();
        var valueType = createValueType(value);
        if (!valueType) {
            throw new Error("Could not resolve the value type of the property '" + property + "' on '" + context + "'.");
        }
        this.context = context;
        this.property = property;
        this.accessor = accessor;
        this.initialValue = initialValue != null ? initialValue : value;
        this.currentValue = this.initialValue;
        this.valueType = valueType;
    }
    Timeline.prototype.getCurrentValue = function () {
        return this.currentValue;
    };
    Timeline.prototype.getPlayState = function () {
        return this.playState;
    };
    Timeline.prototype.stop = function () {
        if (this.playState === 'playing') {
            this.handleStopped();
        }
    };
    Timeline.prototype.handleFinished = function () {
        var onFinished = this.onFinished;
        this.playState = 'finished';
        if (onFinished) {
            setFrameCallback(onFinished);
        }
    };
    Timeline.prototype.handleStopped = function () {
        var onStopped = this.onStopped;
        this.playState = 'stopped';
        if (onStopped)
            onStopped();
    };
    return Timeline;
}());
export { Timeline };
