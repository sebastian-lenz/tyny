import { AbstractAdapter } from './AbstractAdapter';
export declare class PointerAdapter extends AbstractAdapter {
    protected getEvents(): tyny.Map<EventListener>;
    protected getTrackingEvents(): tyny.Map<EventListener>;
    protected handlePointerDown(event: PointerEvent): void;
    protected handlePointerMove(event: PointerEvent): void;
    protected handlePointerUp(event: PointerEvent): void;
    static isSupported(): boolean;
}
