import { AbstractAdapter } from './AbstractAdapter';
import { MouseAdapter } from './MouseAdapter';
import type { PointerBehaviour } from '../PointerBehaviour';
export declare let isIOSFix: boolean;
export declare class TouchAdapter extends AbstractAdapter {
    mouseAdapter: MouseAdapter;
    constructor(element: HTMLElement, pointerList: PointerBehaviour);
    protected getEvents(): tyny.Map<EventListener>;
    protected getTrackingEvents(): tyny.Map<EventListener>;
    protected handleTouchStart(event: TouchEvent): void;
    protected handleTouchMove(event: TouchEvent): void;
    protected handleTouchEnd(event: TouchEvent): void;
    static isSupported(): boolean;
}
