import { Event, EventOptions } from 'tyny-events';

import Image from './Image';

export interface ImageEventOptions extends EventOptions {
  target: Image;
}

export default class ImageEvent extends Event {
  readonly target: Image;

  static loadEvent: string = 'load';

  constructor(options: ImageEventOptions) {
    super(options);
  }
}
