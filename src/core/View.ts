import { emitUpdate } from './components/components';
import { fastDom } from './components';
import { find, findAll, Selector } from '../utils/dom/node/find';
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

    if (within(el, document)) {
      fastDom.read(this._callConnected.bind(this));
    }
  }

  get component(): ViewComponent<this> {
    return this._component;
  }

  callUpdate(type: string = 'update') {
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

  find(selector: Selector): HTMLElement | null {
    return find(selector, this.el);
  }

  findView<T extends View>(selector: Selector, ctor: ViewClass<T>): T | null {
    return this.findAllViews(selector, ctor)[0] || null;
  }

  findAll(selector: Selector): HTMLElement[] {
    return findAll(selector, this.el);
  }

  findAllViews<T extends View>(selector: Selector, ctor: ViewClass<T>): T[] {
    return findAll(selector, this.el).reduce((result, element) => {
      const views = element.__tynyViews;
      if (!views) return result;

      for (const name in views) {
        const view = views[name];
        if (view instanceof ctor) {
          result.push(view);
        }
      }

      return result;
    }, [] as T[]);
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

  protected _callDisconnected() {
    super._callDisconnected();
    (this._behaviours as any).forEach((api: tyny.ViewApi) =>
      api._callDisconnected()
    );
  }
}
