import { View, ViewClass } from './View';
export declare type LazyViewPromise = Promise<{
    default: ViewClass;
}>;
export declare abstract class LazyView extends View {
    onConnected(): void;
    abstract load(): LazyViewPromise;
}