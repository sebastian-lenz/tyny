export type DestructScope = 'destroy' | 'disconnect';
export type Destructor = {
    callback: VoidFunction;
    scope: DestructScope;
};
export declare abstract class Lifecycle {
    private _destructors?;
    private _eventListeners;
    private _isConnected;
    private _updatesTasks;
    private _watchTask;
    private _watchValues;
    private readonly _events;
    private readonly _updates;
    private readonly _properties;
    get isConnected(): boolean;
    callUpdate(type?: string): void;
    addDestructor(callback: VoidFunction, scope?: DestructScope): void;
    destroy(): void;
    abstract get el(): HTMLElement;
    onConnected(): void;
    onDestroyed(): void;
    onDisconnected(): void;
    protected _callConnected(): void;
    protected _callDestroyed(): void;
    protected _callDestructors(scope: DestructScope): void;
    protected _callDisconnected(): void;
    private _bindEvent;
    protected _bindEvents(): void;
    protected _unbindEvents(): void;
    private _watch;
    private _watchWorker;
}
