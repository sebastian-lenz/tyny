import { Animation } from './index';
import { PropertyMap } from './utils/propertyMap';
import { FromToValuesMap } from './utils/toTimelineValues';
import { ValueTypeSource } from './timelines/valueTypes/index';
import { TimelineAnimationOptions } from './utils/timelineAnimation';
export interface Spring extends Animation<void> {
    advance(properties: PropertyMap<ValueTypeSource>): boolean;
}
export interface SpringOptions extends TimelineAnimationOptions {
    acceleration: number;
    epsilon: number;
    friction: number;
}
declare function spring(context: any, properties: FromToValuesMap, options?: Partial<SpringOptions>): Spring;
declare namespace spring {
    const defaultOptions: SpringOptions;
}
export { spring };
