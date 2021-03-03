import { Timeline } from './timelines/Timeline';
export declare function addTimeline(timeline: Timeline): void;
export declare function getTimeline(context: any, property: string): Timeline | undefined;
export declare function stop(context?: any, property?: string): void;
export declare function setFrameCallback(callback: Function): void;
export declare function addFrameHook(hook: Function): void;
export declare function removeFrameHook(hook: Function): void;
