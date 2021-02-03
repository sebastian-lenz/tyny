import { ValueTypeSource } from '../timelines/valueTypes/index';
import { PropertyMap } from './propertyMap';
export interface MomentumValues {
    initialValue?: ValueTypeSource;
    initialVelocity: ValueTypeSource;
    maxValue?: ValueTypeSource;
    minValue?: ValueTypeSource;
}
export interface FromVelocityValues {
    /**
     * The current position on this axis.
     */
    from?: ValueTypeSource;
    /**
     * The maximum allowed position on this axis.
     */
    max?: ValueTypeSource;
    /**
     * The minimum allowed position on this axis.
     */
    min?: ValueTypeSource;
    /**
     * The current velocity on this axis.
     */
    velocity: ValueTypeSource;
}
export declare type FromVelocityValuesMap = PropertyMap<ValueTypeSource | FromVelocityValues>;
export declare type MomentumValuesMap = PropertyMap<MomentumValues>;
export declare function toMomentumValues(map: FromVelocityValuesMap): MomentumValuesMap;
