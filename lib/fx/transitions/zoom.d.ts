import { Transition } from './index';
export interface ZoomOptions {
    duration?: number;
    delay?: number;
    timingFunction?: string;
    zoom: number;
    zoomFrom?: boolean;
    zoomTo?: boolean;
}
export declare function zoom(options?: ZoomOptions): Transition;
