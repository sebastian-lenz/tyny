import { Event, EventOptions } from 'tyny-events';
import View from 'tyny/lib/View';

import Dropdown from './Dropdown';
import DropdownOption from './DropdownOption';

export interface DropdownEventOptions extends EventOptions<Dropdown> {
  option: DropdownOption | null;
}

export default class DropdownEvent extends Event<Dropdown> {
  readonly option: DropdownOption | null;

  static change: string = 'change';

  constructor(options: DropdownEventOptions) {
    super(options);
    this.option = options.option;
  }
}
