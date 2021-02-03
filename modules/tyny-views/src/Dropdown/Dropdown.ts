import { $, View, ViewClass, ViewOptions } from 'tyny';

import DropdownLabel, { DropdownLabelOptions } from './DropdownLabel';
import DropdownList, { Direction, DropdownListOptions } from './DropdownList';
import DropdownOption from './DropdownOption';
import DropdownEvent from './DropdownEvent';

export interface DropdownOptions extends ViewOptions {
  select?: string | HTMLSelectElement;
  labelClass?: ViewClass<DropdownLabel>;
  labelOptions?: DropdownLabelOptions;
  listClass?: ViewClass<DropdownList>;
  listOptions?: DropdownListOptions;
}

export default class Dropdown extends View {
  defaultDirection: Direction | undefined;
  isExpanded: boolean = false;
  label: DropdownLabel;
  list: DropdownList;
  navigate: boolean;
  select: HTMLSelectElement | undefined;
  selected: DropdownOption | null = null;

  constructor(options: DropdownOptions = {}) {
    super(options);

    const args = this.createArgs(options);
    this.navigate = args.bool({ name: 'navigate', defaultValue: false });
    this.select = args.element<HTMLSelectElement>({
      name: 'select',
      tagName: 'select',
      defaultValue: 'select',
    });

    this.defaultDirection = args.enum({
      name: 'defaultDirection',
      enum: Direction,
    });

    const { element, select } = this;
    const { labelClass, labelOptions, listClass, listOptions } = {
      ...options,
      labelClass: DropdownLabel,
      labelOptions: {},
      listClass: DropdownList,
      listOptions: {},
    };

    const label = new labelClass({
      ...labelOptions,
      appendTo: element,
      owner: this,
    });

    const list = new listClass({
      ...listOptions,
      appendTo: element,
      owner: this,
    });

    element.tabIndex = -1;
    this.label = label;
    this.list = list;

    if (select) {
      list.sync(select);
      this.setSelected(list.options[select.selectedIndex] || null, true);
    } else {
      this.setSelected(null, true);
    }
  }

  setExpanded(value: boolean) {
    if (this.isExpanded === value) return;
    this.isExpanded = value;

    this.element.classList.toggle('expanded', value);
    this.list.setExpanded(value);
  }

  setSelected(option: DropdownOption | null, silent?: boolean) {
    const { label, list, select } = this;
    this.selected = option;

    if (select) {
      const index = list.options.findIndex(child => child === option);
      select.selectedIndex = index;
    }

    label.setOption(option);
    list.options.forEach(child => child.setSelected(child === option));
    this.setExpanded(false);

    if (!silent) {
      const event = new DropdownEvent({
        target: this,
        type: DropdownEvent.change,
        option: option,
      });

      this.emit(event);
      if (this.navigate && option && !event.isDefaultPrevented()) {
        window.location.href = option.value;
      }
    }
  }

  onLabelClick() {
    this.setExpanded(true);
  }

  onListClick(option: DropdownOption) {
    this.setSelected(option);
  }

  @$.delegate('change', { selector: 'select' })
  handleChange() {
    const { list, select } = this;
    if (select) {
      this.setSelected(list.options[select.selectedIndex] || null);
    }
  }

  @$.windowPointerDownEvent()
  handleDocumentPointerDown(event: Event) {
    const { element, isExpanded } = this;
    if (!isExpanded) return;

    let target = <HTMLElement>event.target;
    while (target) {
      if (target === element) return;
      target = <HTMLElement>target.parentNode;
    }

    this.setExpanded(false);
  }

  @$.delegate('focusout')
  handleFocusOut(event: Event) {
    this.setExpanded(false);
  }

  @$.delegate('keypress')
  handleKeyPress(event: KeyboardEvent) {}
}
