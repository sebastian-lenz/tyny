import { View } from '../../core';
export interface LoadableView extends View {
    load(): Promise<any>;
}
export declare function isLoadable(value: any): value is LoadableView;
export declare function whenLoaded(element: HTMLElement | null | undefined): Promise<any[]>;
export declare function whenViewLoaded(view: any): Promise<any>;
