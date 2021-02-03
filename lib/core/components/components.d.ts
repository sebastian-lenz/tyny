import type { View, ViewClass } from '../View';
export declare function emitUpdate(target?: tyny.ElementLike, type?: string): void;
export declare function getChildView<TView extends View = View>(parent: HTMLElement | null | undefined, ctor: ViewClass<TView> | string, includeSelf?: boolean): TView | null;
export declare function getChildViews(parent: HTMLElement | null | undefined, includeSelf?: boolean): View[];
export declare function getParentView<TView extends View = View>(element: any, ctor: ViewClass<TView> | string): TView | null;
export declare function getView<TView extends View = View>(element: any, ctor: ViewClass<TView> | string): TView | null;
export declare function getViews(element: any): tyny.ViewMap;
export declare function registerViews(ctors: tyny.Map<ViewClass>): void;
export declare function toggleActiveScrollEvent(origin: any, active: boolean): void;
