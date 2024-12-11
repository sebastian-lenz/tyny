import { ValueTypeSource } from '../timelines/valueTypes/index';
import { PropertyMap } from './propertyMap';
export interface MomentumValues {
    initialValue?: ValueTypeSource;
    initialVelocity: ValueTypeSource;
    maxValue?: ValueTypeSource;
    minValue?: ValueTypeSource;
}
export interface FromVelocityValues {
    from?: ValueTypeSource;
    max?: ValueTypeSource;
    min?: ValueTypeSource;
    velocity: ValueTypeSource;
}
export type FromVelocityValuesMap = PropertyMap<ValueTypeSource | FromVelocityValues>;
export type MomentumValuesMap = PropertyMap<MomentumValues>;
export declare function toMomentumValues(map: FromVelocityValuesMap): MomentumValuesMap;
