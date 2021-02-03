import { Event, EventOptions } from 'tyny-events';

import Image from './Image';

export interface ImageEventOptions extends EventOptions<Image> {}

export default class ImageEvent extends Event<Image> {
  static loadEvent: string = 'load';

  constructor(options: ImageEventOptions) {
    super(options);
  }
}
