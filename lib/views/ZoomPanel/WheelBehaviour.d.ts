import { Behaviour, BehaviourOptions } from '../../core/Behaviour';
import { ZoomPanel } from './index';
export interface WheelBehaviourOptions extends BehaviourOptions {
    enabled?: boolean;
}
export declare class WheelBehaviour extends Behaviour<ZoomPanel> {
    enabled: boolean;
    power: number;
    requireCtrlKey: boolean;
    constructor(view: ZoomPanel, options?: WheelBehaviourOptions);
    handleWheel(event: WheelEvent): void;
    hasCtrlKey(event: WheelEvent): boolean;
    onCtrlAbort(): void;
}
