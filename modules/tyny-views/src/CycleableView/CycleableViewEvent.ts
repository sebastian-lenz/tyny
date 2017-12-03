import { Event, EventOptions } from 'tyny-events';
import { View } from 'tyny';

import CycleableView from './CycleableView';

export interface CycleableViewEventOptions extends EventOptions {
  fromView?: View;
  options: any;
  target: CycleableView;
  toView?: View;
}

export default class CycleableViewEvent extends Event {
  readonly fromView: View | undefined;
  readonly options: any;
  readonly target: CycleableView;
  readonly toView: View | undefined;

  static changeEvent: string = 'change';

  constructor(options: CycleableViewEventOptions) {
    super(options);

    this.fromView = options.fromView;
    this.options = options.options;
    this.toView = options.toView;
  }
}
