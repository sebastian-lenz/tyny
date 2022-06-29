import { Selector } from '../utils/dom/node/find';
import { Lifecycle } from './Lifecycle';
import { Params } from './Params';
import { CreateElementOptions } from '../utils/dom/node/createElement';
import type { Behaviour, BehaviourClass, BehaviourOptions } from './Behaviour';
export interface ViewOptions extends Omit<CreateElementOptions, 'extraClassName'> {
    el?: HTMLElement;
}
export interface ViewDestroyOptions {
    remove?: boolean;
}
export interface ViewClass<TView extends View = View> {
    new (options: ViewOptions): TView;
}
export interface ViewComponent<TView extends View = View> {
    className: string;
    ctor: ViewClass<TView>;
    name: string;
}
export declare class View extends Lifecycle {
    readonly el: HTMLElement;
    readonly params: Params;
    readonly uid: number;
    private readonly _behaviours;
    private readonly _component;
    constructor(options?: ViewOptions);
    get behaviours(): Array<Behaviour>;
    get component(): ViewComponent<this>;
    callUpdate(type?: string): void;
    destroy(options?: ViewDestroyOptions): void;
    find<T extends HTMLElement = HTMLElement>(selector: Selector): T | null;
    findView<T extends View>(selector: Selector, ctor?: string | ViewClass<T>): T | null;
    findAll<T extends HTMLElement = HTMLElement>(selector: Selector): T[];
    findAllViews<T extends View>(selector: Selector, ctor?: string | ViewClass<T>): T[];
    trigger(event: string | Event, detail?: any): void;
    triggerUpdate(type: string): void;
    protected addBehaviour<TBehaviour extends Behaviour, TOptions extends BehaviourOptions>(ctor: BehaviourClass<TBehaviour, TOptions>, options?: TOptions): TBehaviour;
    protected _callConnected(): void;
    protected _callDestroyed(): void;
    protected _callDisconnected(): void;
}
