import { attr } from '../../utils/dom/attr';
import { event, property, update, View, ViewOptions } from '../../core';
import { getWindowHeight, getWindowWidth } from '../../utils/dom/window';
import { Label, template } from './template';
import { toArray } from '../../utils/lang/array/toArray';

export interface DropDownOptions extends ViewOptions {
  flyout?: HTMLElement | string;
  label?: HTMLElement | string;
  groupLabel?: Label<HTMLOptGroupElement>;
  optionLabel?: Label<HTMLOptionElement>;
  selectedLabel?: Label<HTMLOptionElement[]>;
}

export class DropDown extends View {
  groupLabel: Label<HTMLOptGroupElement>;
  optionLabel: Label<HTMLOptionElement>;
  selectedLabel: Label<HTMLOptionElement[]>;

  @property({
    param: {
      className: `${process.env.TYNY_PREFIX}DropDown--flyout`,
      tagName: 'div',
      type: 'element',
    },
  })
  flyout!: HTMLElement;

  @property({
    param: {
      className: `${process.env.TYNY_PREFIX}DropDown--label`,
      tagName: 'div',
      type: 'element',
    },
  })
  label!: HTMLElement;

  @property({
    param: { defaultValue: 'select', type: 'element' },
    watch: 'onElementChanged',
  })
  select!: HTMLSelectElement | null;

  constructor({
    groupLabel = (el) => el.label,
    optionLabel = (el) => el.label,
    selectedLabel = (els) => els.map((el) => el.label).join(', '),
    ...options
  }: DropDownOptions = {}) {
    super(options);

    this.el.tabIndex = 0;
    this.groupLabel = groupLabel;
    this.optionLabel = optionLabel;
    this.selectedLabel = selectedLabel;
  }

  protected onConnected() {
    this.renderFlyout();
  }

  protected onElementChanged() {
    this.renderFlyout();
  }

  @event({ name: 'click', selector: '*[data-dropdown-value]' })
  protected onOptionClick(event: tyny.DelegateEvent) {
    this.toggleValue(attr(event.current, 'data-dropdown-value') || '');
    this.el.blur();
  }

  @update({ events: ['resize', 'scroll'], mode: 'read' })
  onUpdate() {
    const { flyout } = this;
    const rect = this.el.getBoundingClientRect();
    const height = flyout.clientHeight;
    const viewHeight = getWindowHeight();

    return () => {
      flyout.classList.toggle('top', viewHeight - rect.bottom < height + 20);
    };
  }

  @event({ name: 'change', selector: 'select' })
  protected onValueChanged() {
    this.renderLabel();
  }

  protected renderFlyout() {
    const { component, groupLabel, optionLabel, select } = this;
    this.flyout.innerHTML = select
      ? template({
          className: component.className,
          element: select,
          groupLabel,
          optionLabel,
        })
      : '';

    this.renderLabel();
  }

  protected renderLabel() {
    const { label, select, selectedLabel } = this;
    if (!select) {
      label.innerHTML = '';
      label.removeAttribute('data-dropdown-selected');
      return;
    }

    const selected = toArray(select.selectedOptions);
    const values = selected.map((option) => option.value);
    label.innerHTML = selectedLabel(selected);
    label.setAttribute('data-dropdown-selected', values.join(','));

    this.findAll(`*[data-dropdown-value]`).forEach((element) =>
      element.classList.toggle(
        'selected',
        values.indexOf(attr(element, 'data-dropdown-value') || '') !== -1
      )
    );
  }

  protected toggleValue(value: string) {
    const { select } = this;
    if (!select) {
      return;
    }

    const oldValue = select.value;
    const option = select.querySelector<HTMLOptionElement>(
      `option[value="${value}"]`
    );

    if (option) {
      option.selected = select.multiple ? !option.selected : true;
    }

    if (select.value !== oldValue) {
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}
