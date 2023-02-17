import { Lifecycle } from './Lifecycle';

import type { View } from './View';

export interface BehaviourClass<
  TBehaviour extends Behaviour,
  TOptions extends BehaviourOptions = BehaviourOptions
> {
  new (view: any, options: TOptions): TBehaviour;
}

export interface BehaviourOptions {}

export class Behaviour<TView extends View = View> extends Lifecycle {
  readonly view: TView;

  constructor(view: TView, options: BehaviourOptions = {}) {
    super();
    this.view = view;
  }

  get el(): HTMLElement {
    return this.view.el;
  }

  onConnected() {}

  onDestroyed() {}

  onDisconnected() {}
}
