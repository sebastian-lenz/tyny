import { $, View, ViewClass } from 'tyny';
import { viewport } from 'tyny-services';

import { ChildableView, ChildableViewOptions } from '../ChildableView';
import Dropdown from './Dropdown';
import DropdownGroup, { DropdownGroupOptions } from './DropdownGroup';
import DropdownOption, { DropdownOptionOptions } from './DropdownOption';

export type DropdownListChild = DropdownGroup | DropdownOption;

export enum Direction {
  Bottom,
  Top,
}

export interface DropdownListOptions extends ChildableViewOptions {
  groupClass?: ViewClass<DropdownGroup>;
  groupOptions?: DropdownGroupOptions;
  optionClass?: ViewClass<DropdownOption>;
  optionOptions?: DropdownOptionOptions;
  owner: Dropdown;
}

export default class DropdownList extends ChildableView<DropdownListChild> {
  direction: Direction = Direction.Bottom;
  dropdown: Dropdown;
  groupClass: ViewClass<DropdownGroup>;
  groupOptions: DropdownGroupOptions;
  isExpanded: boolean = false;
  optionClass: ViewClass<DropdownOption>;
  optionOptions: DropdownOptionOptions;
  options: DropdownOption[] = [];

  constructor(options: DropdownListOptions) {
    super({
      className: `${View.classNamePrefix}DropdownList`,
      ...options,
    });

    this.dropdown = options.owner;
    this.groupClass = options.groupClass || DropdownGroup;
    this.groupOptions = options.groupOptions || {};
    this.optionClass = options.optionClass || DropdownOption;
    this.optionOptions = options.optionOptions || {};
  }

  setExpanded(value: boolean) {
    if (this.isExpanded === value) return;
    this.isExpanded = value;

    if (value) this.updateDirection();
    this.toggleClass('expanded', value);
  }

  sync(select: HTMLSelectElement) {
    const { optionClass, optionOptions, groupClass, groupOptions } = this;
    if (!select) return;

    this.removeAllChildren();
    this.options.length = 0;

    const nodes = select.childNodes;
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      let child = null;
      if (node.nodeName === 'OPTION') {
        child = this.syncOption(<HTMLOptionElement>node);
      } else if (node.nodeName === 'OPTGROUP') {
        child = this.syncGroup(<HTMLOptGroupElement>node);
      }

      if (child) {
        this.addChild(child);
      }
    }
  }

  protected syncGroup(group: HTMLOptionElement) {
    const { groupClass, groupOptions } = this;
    const options = {
      ...groupOptions,
      appendTo: this.element,
      group,
      owner: this,
    };

    const child = new groupClass(options);
    const nodes = group.childNodes;
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.nodeName !== 'OPTION') continue;

      const option = this.syncOption(<HTMLOptionElement>node);
      child.addChild(option);
    }

    return child;
  }

  protected syncOption(option: HTMLOptGroupElement) {
    const { optionClass, optionOptions } = this;
    const child = new optionClass({
      ...optionOptions,
      appendTo: this.element,
      option,
      owner: this,
    });

    this.options.push(child);
    return child;
  }

  updateDirection() {
    const { dropdown } = this;
    let direction = this.direction;

    if (dropdown.defaultDirection) {
      direction = dropdown.defaultDirection;
    } else {
      const { top } = dropdown.element.getBoundingClientRect();
      direction =
        top > viewport().height * 0.5 ? Direction.Top : Direction.Bottom;
    }

    if (this.direction === direction) return;
    this.direction = direction;
    this.toggleClass('top', direction === Direction.Top);
  }

  @$.delegate('click')
  handleClick(event: Event) {
    const { dropdown, element, options } = this;
    let target = <HTMLElement>event.target;

    while (target && target !== element) {
      const option = options.find(option => option.element === target);
      if (dropdown && option) {
        dropdown.onListClick(option);
        return true;
      }

      target = <HTMLElement>target.parentNode;
    }

    return false;
  }
}
