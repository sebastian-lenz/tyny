import { Behaviour } from '../../core/Behaviour';
import { ZoomPanel } from './index';
export declare class WheelBehaviour extends Behaviour<ZoomPanel> {
    enabled: boolean;
    power: number;
    requireCtrlKey: boolean;
    handleWheel(event: WheelEvent): void;
    hasCtrlKey(event: WheelEvent): boolean;
    onCtrlAbort(): void;
}
