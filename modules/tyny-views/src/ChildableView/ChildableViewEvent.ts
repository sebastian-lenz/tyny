import { View } from 'tyny';
import { Event, EventOptions } from 'tyny-events';

import ChildableView from './ChildableView';

export interface ChildableViewEventOptions extends EventOptions<ChildableView> {
  index: number;
  view: View;
}

export default class ChildableViewEvent extends Event<ChildableView> {
  readonly index: number;
  readonly view: View;

  static addEvent: string = 'add';
  static removeEvent: string = 'remove';

  constructor(options: ChildableViewEventOptions) {
    super(options);

    this.index = options.index;
    this.view = options.view;
  }
}
