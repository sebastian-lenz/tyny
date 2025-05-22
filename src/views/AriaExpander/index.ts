import { boolify } from '../../utils/lang/string';
import { data } from '../../utils/dom/attr';
import { event, View } from '../../core';
import { toBoolean } from '../../utils/lang/misc';
import { transistHeight } from '../../fx/transistHeight';
import type { ViewOptions } from '../../core';

export interface AriaExpanderOptions extends ViewOptions {
  mask?: HTMLElement | string;
}

export class AriaExpander extends View {
  button: HTMLElement | null;
  isExpanded: boolean;
  mask: HTMLElement | null;
  target: HTMLElement | null;

  constructor(options: AriaExpanderOptions) {
    super(options);

    const button = this.find('*[aria-controls]');
    const targetId = data(button, 'aria-controls');

    this.button = button;
    this.target = targetId ? document.getElementById(targetId) : null;
    this.isExpanded = toBoolean(data(button, 'aria-expanded'));
    this.mask = this.params.element({
      name: 'mask',
      defaultValue: this.target || undefined,
    });
  }

  @event({ name: 'click', selector: '*[aria-controls]' })
  onButtonClick(event: tyny.DelegateEvent) {
    this.setExpanded();
  }

  setExpanded(value: boolean = !this.isExpanded) {
    if (this.isExpanded === value) return;
    this.isExpanded = value;

    const { button, mask, target } = this;

    if (button) {
      button.setAttribute('aria-expanded', boolify(value));
    }

    if (target) {
      target.setAttribute('aria-hidden', boolify(!value));
    }

    if (mask) {
      transistHeight(mask, () => {
        mask.classList.add('animated');
        mask.classList.toggle('expanded', value);
      }).then(() => mask.classList.remove('animated'));
    }
  }
}
