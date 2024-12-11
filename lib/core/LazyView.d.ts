import { View, ViewClass } from './View';
export type LazyViewPromise = Promise<{
    default: ViewClass;
}>;
export declare abstract class LazyView extends View {
    onConnected(): void;
    loadAndRegisterView(): LazyViewPromise;
    abstract loadView(): LazyViewPromise;
}
export declare function registerLazyView(name: string, loadView: () => LazyViewPromise): void;
