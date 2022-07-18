import { Behaviour, BehaviourOptions } from '../Behaviour';
import { on } from '../../utils/dom/event';
import type { View } from '../View';

export interface ClickBehaviourOptions extends BehaviourOptions {
  onClick?: (event: Event) => void;
}

export class ClickBehaviour<
  TView extends View = View
> extends Behaviour<TView> {
  listeners: Array<Function> | null;
  onClick: ((event: Event) => void) | null;
  shouldPreventNextClick: boolean = false;

  constructor(view: TView, options: ClickBehaviourOptions) {
    super(view, options);

    this.onClick = options.onClick || null;
    const listeners = (this.listeners = [
      on(view.el, 'click', this.onViewClick, { capture: true, scope: this }),
    ]);
  }

  onDestroyed() {
    super.onDestroyed();

    if (this.listeners) {
      this.listeners.forEach((off) => off());
      this.listeners = null;
    }
  }

  onViewClick(event: Event) {
    if (this.shouldPreventNextClick) {
      this.shouldPreventNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    } else if (this.onClick) {
      this.onClick(event);
    }
  }

  preventNextClick() {
    this.shouldPreventNextClick = true;
    setTimeout(() => {
      this.shouldPreventNextClick = false;
    }, 200);
  }

  static getClickBehaviour(view: View) {
    for (const behaviour of view.behaviours) {
      if (behaviour instanceof ClickBehaviour) {
        return behaviour;
      }
    }

    return null;
  }

  static tryPreventNextClick(view: View) {
    this.getClickBehaviour(view)?.preventNextClick();
  }
}
