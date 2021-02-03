import { numericValueType } from './numericValueType';
import { vectorValueType } from './vectorValueType';
export const valueTypeFactories = [
    numericValueType,
    vectorValueType,
];
export function createValueType(value) {
    return valueTypeFactories.reduce((valueType, factory) => (valueType ? valueType : factory(value)), undefined);
}
