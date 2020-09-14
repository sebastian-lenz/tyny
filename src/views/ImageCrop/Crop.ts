import type { Params } from '../../core/Params';
import type { View } from '../../core';

export enum CropMode {
  Cover,
  Fit,
  Stretch,
  Width,
  Height,
}

export interface CropOptions {
  disableMaskResize?: boolean;
  focusY?: number;
  focusX?: number;
  maxScale?: number;
  minScale?: number;
  mode?: CropMode;
}

export interface CropResult {
  left: number;
  top: number;
  width: number;
  height: number;
  forcedHeight: number | undefined;
  forcedWidth: number | undefined;
}

function shift(
  space: number,
  size: number,
  focus: number,
  invert?: boolean
): number {
  if (invert) focus = 1 - focus;

  let shift = Math.round(-size * focus + space / 2);
  if (space < size) {
    if (shift > 0) shift = 0;
    if (shift < space - size) shift = space - size;
  }

  return shift;
}

const defaultOptions = {
  disableMaskResize: false,
  focusY: 0.5,
  focusX: 0.5,
  height: 0,
  maxScale: Number.MAX_VALUE,
  minScale: 0,
  mode: CropMode.Cover,
  width: 0,
};

export class Crop {
  disableMaskResize: boolean = false;
  focusX: number = 0.5;
  focusY: number = 0.5;
  height: number = 0;
  maxScale: number = Number.MAX_VALUE;
  minScale: number = 0;
  mode: CropMode = CropMode.Cover;
  width: number = 0;

  constructor(options?: CropOptions) {
    let resolved: CropOptions;
    if (options) {
      resolved = options;
    } else {
      resolved = {};
    }

    Object.assign(this, defaultOptions, resolved);
  }

  apply(
    mask: HTMLElement,
    image: HTMLElement,
    maskWidth: number = NaN,
    maskHeight: number = NaN
  ): CropResult {
    if (isNaN(maskWidth)) maskWidth = mask.offsetWidth;
    if (isNaN(maskHeight)) maskHeight = mask.offsetHeight;
    const result = this.getCrop(maskWidth, maskHeight);
    const { left, top, width, height, forcedHeight, forcedWidth } = result;

    const { style } = image;
    style.left = `${Math.floor(left)}px`;
    style.top = `${Math.floor(top)}px`;
    style.width = `${Math.ceil(width)}px`;
    style.height = `${Math.ceil(height)}px`;

    if (!this.disableMaskResize) {
      mask.style.width = forcedWidth == null ? '' : `${forcedWidth}px`;
      mask.style.height = forcedHeight == null ? '' : `${forcedHeight}px`;
    }

    return result;
  }

  clone(options: CropOptions = {}) {
    return new Crop({
      ...this.toOptions,
      ...options,
    });
  }

  getImageDimensions(maskWidth: number, maskHeight: number): tyny.Dimensions {
    let scale = 1;
    const { mode, height, width, maxScale, minScale } = this;

    switch (mode) {
      case CropMode.Stretch:
        return {
          width: maskWidth,
          height: maskHeight,
        };
      case CropMode.Cover:
        scale = Math.max(maskWidth / width, maskHeight / height);
        break;
      case CropMode.Fit:
        scale = Math.min(maskWidth / width, maskHeight / height);
        break;
      case CropMode.Width:
        scale = maskWidth / width;
        break;
      case CropMode.Height:
        scale = maskHeight / height;
        break;
    }

    if (scale > maxScale) scale = maxScale;
    if (scale < minScale) scale = minScale;

    return {
      width: width * scale,
      height: height * scale,
    };
  }

  getCrop(maskWidth: number, maskHeight: number): CropResult {
    const { focusX, focusY, mode } = this;
    let { width, height } = this.getImageDimensions(maskWidth, maskHeight);
    let left: number = 0;
    let top: number = 0;
    let forcedHeight: number | undefined;
    let forcedWidth: number | undefined;

    switch (mode) {
      case CropMode.Cover:
        left = shift(maskWidth, width, focusX);
        top = shift(maskHeight, height, focusY);
        break;
      case CropMode.Fit:
        left = (maskWidth - width) * focusX;
        top = (maskHeight - height) * focusY;
        break;
      case CropMode.Width:
        forcedHeight = height;
        break;
      case CropMode.Height:
        forcedWidth = width;
        break;
    }

    return {
      left,
      top,
      width,
      height,
      forcedHeight,
      forcedWidth,
    };
  }

  toOptions(): CropOptions {
    return {
      disableMaskResize: this.disableMaskResize,
      focusY: this.focusY,
      focusX: this.focusX,
      maxScale: this.maxScale,
      minScale: this.minScale,
      mode: this.mode,
    };
  }

  static create(view: View, { crop }: { crop?: Crop | CropOptions }): Crop {
    if (crop instanceof Crop) {
      return crop;
    }

    return crop ? new Crop(crop) : Crop.fromParams(view.params);
  }

  static fromParams(params: Params): Crop {
    return new Crop({
      disableMaskResize: params.bool({
        name: 'disableMaskResize',
        defaultValue: false,
      }),
      focusY: params.number({ name: 'focusY', defaultValue: 0.5 }),
      focusX: params.number({ name: 'focusX', defaultValue: 0.5 }),
      maxScale: params.number({
        name: 'maxScale',
        defaultValue: Number.MAX_VALUE,
      }),
      minScale: params.number({ name: 'minScale', defaultValue: 0 }),
      mode: params.enum({
        name: 'mode',
        enum: CropMode,
        defaultValue: CropMode.Cover,
      }),
    });
  }
}
