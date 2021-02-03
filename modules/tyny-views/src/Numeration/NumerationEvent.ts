import { Event, EventOptions } from 'tyny-events';

import Numeration from './Numeration';

export interface NumerationEventOptions extends EventOptions<Numeration> {
  index: number;
}

export default class NumerationEvent extends Event<Numeration> {
  readonly index: number;
  static changeEvent: string = 'change';

  constructor(options: NumerationEventOptions) {
    super(options);
    this.index = options.index;
  }
}
