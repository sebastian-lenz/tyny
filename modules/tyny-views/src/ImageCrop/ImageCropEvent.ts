import { Event, EventOptions } from 'tyny-events';

import ImageCrop from './ImageCrop';

export interface ImageCropEventOptions extends EventOptions<ImageCrop> {
  target: ImageCrop;
}

export default class ImageCropEvent extends Event<ImageCrop> {
  static loadEvent: string = 'load';

  constructor(options: ImageCropEventOptions) {
    super(options);
  }
}
