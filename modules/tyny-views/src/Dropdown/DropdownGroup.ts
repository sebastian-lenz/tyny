import { View } from 'tyny';

import { ChildableView, ChildableViewOptions } from '../ChildableView';

export interface DropdownGroupOptions extends ChildableViewOptions {
  containerClassName?: string;
  group?: HTMLOptGroupElement;
  labelClassName?: string;
}

export default class DropdownGroup extends ChildableView {
  label: HTMLElement;
  container: HTMLElement;

  constructor(options: DropdownGroupOptions) {
    super(
      (options = {
        className: `${View.classNamePrefix}DropdownGroup`,
        ...options,
      })
    );

    const { element } = this;
    const { className, group } = options;
    const {
      containerClassName = `${className}--container`,
      labelClassName = `${className}--label`,
    } = options;

    const label = (this.label = document.createElement('div'));
    label.className = labelClassName;
    element.appendChild(label);

    const container = (this.container = document.createElement('div'));
    container.className = containerClassName;
    element.appendChild(container);

    if (group) {
      this.setCaption(group.label);
    }
  }

  setCaption(value: string) {
    this.label.innerHTML = value;
  }
}
