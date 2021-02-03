import { $, View, ViewOptions } from 'tyny';

import Dropdown from './Dropdown';
import DropdownOption from './DropdownOption';

export interface DropdownLabelOptions extends ViewOptions {
  emptyLabel?: string;
  owner: Dropdown;
}

export default class DropdownLabel extends View {
  dropdown: Dropdown;
  emptyLabel: string;
  extraClass: string | null = null;
  option: DropdownOption | null = null;

  constructor(options: DropdownLabelOptions) {
    super({
      className: `${View.classNamePrefix}DropdownLabel`,
      ...options,
    });

    this.dropdown = options.owner;
    this.emptyLabel = this.createArgs(options).string({
      name: 'emptyLabel',
      defaultValue: '-',
    });
  }

  setExtraClass(extraClass: string) {
    if (this.extraClass === extraClass) return;
    if (this.extraClass) this.removeClass(this.extraClass);

    this.extraClass = extraClass;
    if (extraClass) this.addClass(extraClass);
  }

  setOption(option: DropdownOption | null) {
    if (this.option === option) return;

    const { element, emptyLabel } = this;
    element.innerHTML = option ? option.caption : emptyLabel;

    this.setExtraClass(option ? option.extraClass : 'empty');
    this.option = option;
  }

  @$.delegate('click')
  handleClick(event: Event) {
    event.preventDefault();
    this.dropdown.onLabelClick();
  }
}
