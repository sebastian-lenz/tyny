import { numericValueType } from './numericValueType';
import { vectorValueType } from './vectorValueType';
export var valueTypeFactories = [
    numericValueType,
    vectorValueType,
];
export function createValueType(value) {
    return valueTypeFactories.reduce(function (valueType, factory) { return (valueType ? valueType : factory(value)); }, undefined);
}
