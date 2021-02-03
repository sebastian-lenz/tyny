import { $, View, ViewOptions } from 'tyny';

export interface DropdownOptionOptions extends ViewOptions {
  option?: HTMLOptionElement;
}

export default class DropdownOption extends View {
  caption: string = '';
  extraClass: string = '';
  isSelected: boolean = false;
  value: string = '';

  constructor(options: DropdownOptionOptions) {
    super({
      className: `${View.classNamePrefix}DropdownOption`,
      ...options,
    });

    const { option } = options;
    if (option) {
      this.value = option.value;
      this.setCaption(option.innerHTML);

      const extraClass = option.getAttribute('data-class');
      if (extraClass) {
        this.extraClass = extraClass;
        this.addClass(extraClass);
      }
    }
  }

  setCaption(value: string) {
    this.caption = value;
    this.element.innerHTML = value;
  }

  setSelected(value: boolean) {
    if (this.isSelected === value) return;
    this.isSelected = value;

    this.toggleClass('selected', value);
  }
}
