import { DragDirection } from '../../core/pointers/DragBehaviour';
import { Tween, TweenOptions } from '../../fx/tween';
import { View, ViewOptions } from '../../core';
import { DragScrollBehaviour, DragScrollBehaviourOptions, ScrollableView } from './DragScrollBehaviour';
export declare const scrollerScrollEvent = "tyny:scrollerScroll";
export interface ScrollerEventArgs {
    target: Scroller;
    position: tyny.Point;
}
export interface ScrollerItem {
    el: HTMLElement;
}
export interface ScrollerOptions extends ViewOptions {
    content?: HTMLElement | string;
    dragOptions?: DragScrollBehaviourOptions;
    direction?: DragDirection;
    itemSelector?: string;
    position?: tyny.Point;
    useContentMargins?: boolean;
    viewport?: HTMLElement | string;
}
export declare class Scroller<TItem extends ScrollerItem = ScrollerItem> extends View implements ScrollableView {
    currentTarget: tyny.Point | null;
    currentTween: Tween | null;
    use3DTransform: boolean;
    readonly direction: DragDirection;
    readonly dragBehaviour: DragScrollBehaviour;
    readonly positionBounds: tyny.BoundingBox;
    readonly viewportSize: tyny.Dimensions;
    protected _position: tyny.Point;
    content: HTMLElement | null;
    get items(): TItem[];
    itemSelector: string;
    useContentMargins: boolean;
    viewport: HTMLElement | null;
    constructor(options: ScrollerOptions);
    get isPositionPaged(): boolean;
    get position(): tyny.Point;
    set position(value: tyny.Point);
    clampPosition(value: tyny.Point): tyny.Point;
    createItem(el: HTMLElement, index: number): TItem;
    gotoPosition(value: tyny.Point): void;
    setPosition(value: tyny.Point): void;
    toDisplayOffset(value: tyny.Point): tyny.Point;
    toLocalOffset(value: tyny.Point): tyny.Point;
    tweenTo(position: tyny.Point, options?: Partial<TweenOptions>): Tween;
    onMeasure(): void;
    onResize(): void;
}
