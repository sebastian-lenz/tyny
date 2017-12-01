import { Event, EventOptions } from 'tyny-events';

import ImageCrop from './index';

export interface ImageCropEventOptions extends EventOptions {
  target: ImageCrop;
}

export default class ImageCropEvent extends Event {
  readonly target: ImageCrop;

  static loadEvent: string = 'load';

  constructor(options: ImageCropEventOptions) {
    super(options);
  }
}
