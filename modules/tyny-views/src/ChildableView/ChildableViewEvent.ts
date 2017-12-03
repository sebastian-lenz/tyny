import { View } from 'tyny';
import { Event, EventOptions } from 'tyny-events';

import ChildableView from './ChildableView';

export interface ChildableViewEventOptions extends EventOptions {
  index: number;
  target: ChildableView;
  view: View;
}

export default class ChildableViewEvent extends Event {
  readonly index: number;
  readonly target: ChildableView;
  readonly view: View;

  static addEvent: string = 'add';
  static removeEvent: string = 'remove';

  constructor(options: ChildableViewEventOptions) {
    super(options);

    this.index = options.index;
    this.view = options.view;
  }
}
