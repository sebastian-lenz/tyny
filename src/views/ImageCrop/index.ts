import { Crop, CropMode, CropOptions, CropResult } from './Crop';
import { data } from '../../utils/dom/attr/data';
import { View, ViewOptions, update, property, getView } from '../../core';

import type { Image } from '../Image';

export interface ImageCropOptions extends ViewOptions, Partial<CropOptions> {
  crop?: Crop | CropOptions;
  target?: HTMLElement | string;
}

export class ImageCrop extends View {
  //
  currentCrop: CropResult | null = null;
  crop: Crop;
  displayHeight: number = Number.NaN;
  displayWidth: number = Number.NaN;

  @property({ param: { defaultValue: '> img', type: 'element' } })
  target!: HTMLElement | null;

  constructor(options: ImageCropOptions = {}) {
    super(options);
    this.crop = Crop.create(this, options);
  }

  forceDraw() {
    this.onSizeChanged();
  }

  getDisplaySize() {
    const { height, width } = this.el.getBoundingClientRect();

    return {
      height,
      width,
    };
  }

  @update({ events: ['resize', 'update'], mode: 'read' })
  protected onMeasure() {
    const { height, width } = this.getDisplaySize();

    if (this.displayHeight !== height || this.displayWidth !== width) {
      this.displayHeight = height;
      this.displayWidth = width;
      return this.onSizeChanged;
    }
  }

  protected onSizeChanged() {
    const { crop, target } = this;
    if (!target) {
      return;
    }

    const image = getView<Image>(target, 'Image');
    if (image) {
      crop.height = image.naturalHeight;
      crop.width = image.naturalWidth;
    } else {
      crop.height = parseFloat(data(target, 'height') || '0');
      crop.width = parseFloat(data(target, 'width') || '0');
    }

    this.currentCrop = crop.apply(
      this.el,
      target,
      this.displayWidth,
      this.displayHeight
    );

    if (image) {
      image.callUpdate('update');
    }
  }
}
