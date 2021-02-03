import { DragDirection } from '../../core/pointers/DragBehaviour';
import { DragScrollBehaviour, ScrollableView } from './DragScrollBehaviour';
import { Tween, TweenOptions } from '../../fx/tween';
import { View, ViewOptions } from '../../core';
export declare const scrollerScrollEvent = "tyny:scrollerScroll";
export interface ScrollerEventArgs {
    target: Scroller;
    position: tyny.Point;
}
export interface ScrollerOptions extends ViewOptions {
    content?: HTMLElement | string;
    direction?: DragDirection;
    itemSelector?: string;
    position?: tyny.Point;
    useContentMargins?: boolean;
    viewport?: HTMLElement | string;
}
export declare class Scroller extends View implements ScrollableView {
    currentTarget: tyny.Point | null;
    currentTween: Tween | null;
    readonly direction: DragDirection;
    readonly dragBehaviour: DragScrollBehaviour;
    readonly positionBounds: tyny.BoundingBox;
    readonly viewportSize: tyny.Dimensions;
    protected _position: tyny.Point;
    content: HTMLElement | null;
    get items(): HTMLElement[];
    itemSelector: string;
    useContentMargins: boolean;
    viewport: HTMLElement | null;
    constructor(options: ScrollerOptions);
    get isPositionPaged(): boolean;
    get position(): tyny.Point;
    set position(value: tyny.Point);
    clampPosition(value: tyny.Point): tyny.Point;
    gotoPosition(value: tyny.Point): void;
    setPosition(value: tyny.Point): void;
    toDisplayOffset(value: tyny.Point): tyny.Point;
    toLocalOffset(value: tyny.Point): tyny.Point;
    tweenTo(position: tyny.Point, options?: Partial<TweenOptions>): void;
    protected onMeasure(): void;
    protected onResize(): void;
}
