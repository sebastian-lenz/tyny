import { AbstractAdapter } from './AbstractAdapter';
export declare class MouseAdapter extends AbstractAdapter {
    protected muteTimeout: number | undefined;
    protected getEvents(): tyny.Map<EventListener>;
    protected getTrackingEvents(): tyny.Map<EventListener>;
    mute(): void;
    protected handleMouseDown(event: MouseEvent): void;
    protected handleMouseMove(event: MouseEvent): void;
    protected handleMouseUp(event: MouseEvent): void;
    static isSupported(): boolean;
}
