import { Event, EventOptions } from 'tyny-events';
import { View } from 'tyny';

import CycleableView from './CycleableView';

export interface CycleableViewEventOptions extends EventOptions<CycleableView> {
  fromView?: View;
  options: any;
  toView?: View;
}

export default class CycleableViewEvent extends Event<CycleableView> {
  readonly fromView: View | undefined;
  readonly options: any;
  readonly toView: View | undefined;

  static changeEvent: string = 'change';

  constructor(options: CycleableViewEventOptions) {
    super(options);

    this.fromView = options.fromView;
    this.options = options.options;
    this.toView = options.toView;
  }
}
