import { clearViewCache, emitUpdate } from './components/components';
import { fastDom } from './components';
import { find, findAll, Selector } from '../utils/dom/node/find';
import { findAllViews, findView } from '../utils/dom/node/findView';
import { isEmpty } from '../utils/lang/misc/isEmpty';
import { Lifecycle } from './Lifecycle';
import { Params } from './Params';
import { removeNode } from '../utils/dom/node/removeNode';
import { trigger } from '../utils/dom/event/trigger';
import { within } from '../utils/dom/node/within';
import {
  createElement,
  CreateElementOptions,
} from '../utils/dom/node/createElement';

import type { Behaviour, BehaviourClass, BehaviourOptions } from './Behaviour';

let uid: number = 0;

export interface ViewOptions
  extends Omit<CreateElementOptions, 'extraClassName'> {
  el?: HTMLElement;
  isUpgrade?: boolean;
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

export class View extends Lifecycle {
  readonly el: HTMLElement;
  readonly params: Params;
  readonly uid: number;

  private readonly _behaviours: Array<Behaviour> = [];
  private readonly _component!: ViewComponent<this>;

  constructor(options: ViewOptions = {}) {
    super();
    const { className: extraClassName, name } = this._component;
    const el = options.el || createElement({ ...options, extraClassName });
    const views = el.__tynyViews || (el.__tynyViews = {});

    if (name in views) {
      throw new Error(`View ${name} already exists on target.`);
    } else {
      views[name] = this;
    }

    this.el = el;
    this.params = new Params(this, options);
    this.uid = uid++;

    clearViewCache();
    if (within(el, document)) {
      fastDom.read(this._callConnected.bind(this));
    }
  }

  get behaviours(): Array<Behaviour> {
    return [...this._behaviours];
  }

  get component(): ViewComponent<this> {
    return this._component;
  }

  addClass(...tokens: string[]): this {
    this.el.classList.add(...tokens);
    return this;
  }

  callUpdate(type?: string) {
    super.callUpdate(type);

    (this._behaviours as any).forEach((api: tyny.ViewApi) =>
      api.callUpdate(type)
    );
  }

  destroy(options?: ViewDestroyOptions): void {
    const { el, _component } = this;
    super.destroy();

    if (el.__tynyViews) {
      delete el.__tynyViews[_component.name];
      if (isEmpty(el.__tynyViews)) {
        delete el.__tynyViews;
      }
    }

    if (options && options.remove) {
      removeNode(el);
    }
  }

  find<T extends HTMLElement = HTMLElement>(selector: Selector): T | null {
    return find<T>(selector, this.el);
  }

  findView<T extends View>(
    selector: Selector,
    ctor?: string | ViewClass<T>
  ): T | null {
    return findView(selector, this.el, ctor);
  }

  findAll<T extends HTMLElement = HTMLElement>(selector: Selector): T[] {
    return findAll<T>(selector, this.el);
  }

  findAllViews<T extends View>(
    selector: Selector,
    ctor?: string | ViewClass<T>
  ): T[] {
    return findAllViews(selector, this.el, ctor);
  }

  hasClass(token: string): boolean {
    return this.el.classList.contains(token);
  }

  removeClass(...tokens: string[]): this {
    this.el.classList.remove(...tokens);
    return this;
  }

  toggleClass(token: string, force?: boolean): this {
    this.el.classList.toggle(token, force);
    return this;
  }

  trigger(event: string | Event, detail?: any) {
    trigger(this.el, event, detail);
  }

  triggerUpdate(type: string) {
    emitUpdate(this.el, type);
  }

  // Protected methods
  // -----------------

  protected addBehaviour<
    TBehaviour extends Behaviour,
    TOptions extends BehaviourOptions
  >(
    ctor: BehaviourClass<TBehaviour, TOptions>,
    options: TOptions = {} as TOptions
  ): TBehaviour {
    const behaviour = new ctor(this, options);
    this._behaviours.push(behaviour);
    return behaviour;
  }

  // Lifecycle API
  // -------------

  protected _callConnected() {
    super._callConnected();
    (this._behaviours as any).forEach((api: tyny.ViewApi) =>
      api._callConnected()
    );

    this.callUpdate();
  }

  protected _callDestroyed() {
    super._callDestroyed();
    (this._behaviours as any).forEach((api: tyny.ViewApi) =>
      api._callDestroyed()
    );
  }

  protected _callDisconnected() {
    super._callDisconnected();
    (this._behaviours as any).forEach((api: tyny.ViewApi) =>
      api._callDisconnected()
    );
  }
}
