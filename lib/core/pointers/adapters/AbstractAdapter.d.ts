import { PointerBehaviour } from '../PointerBehaviour';
export declare abstract class AbstractAdapter {
    usePassiveEvents: boolean;
    readonly element: HTMLElement;
    readonly pointerList: PointerBehaviour;
    private _isTracking;
    private _listeners;
    private _trackingListeners;
    constructor(element: HTMLElement, pointerList: PointerBehaviour);
    dispose(): void;
    updateTracking(): void;
    protected abstract getEvents(): tyny.Map<EventListener>;
    protected abstract getTrackingEvents(): tyny.Map<EventListener>;
    protected startTracking(): void;
    protected stopTracking(): void;
}
