import { DimensionsType } from 'tyny-utils/lib/types/Dimensions';
import parseConfig, { OptionDefinition } from 'tyny/lib/utils/parseConfig';

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

export function cropOptions(): OptionDefinition[] {
  return [
    { name: 'disableMaskResize', type: 'bool' },
    { name: 'focusX', type: 'number' },
    { name: 'focusY', type: 'number' },
    { name: 'maxScale', type: 'number' },
    { name: 'minScale', type: 'number' },
    { name: 'mode', type: 'enum', values: CropMode },
  ];
}

/**
 * Calculate the shift value for a dimension based upon the given focus value.
 *
 * @param space
 *   The available space within the dimension.
 * @param size
 *   The size of the image within the dimension.
 * @param focus
 *   The focus point value within the dimension.
 * @param invert
 *   Whether the focus point should be inverted or not.
 * @returns
 *   The calculated position shift along the dimension.
 */
function shift(
  space: number,
  size: number,
  focus: number,
  invert?: boolean
): number {
  if (invert) focus = 1 - focus;

  let shift = Math.round(-size * focus + space / 2);
  if (shift > 0) shift = 0;
  if (shift < space - size) shift = space - size;
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

export default class Crop {
  disableMaskResize: boolean = false;
  focusX: number = 0.5;
  focusY: number = 0.5;
  height: number = 0;
  maxScale: number = Number.MAX_VALUE;
  minScale: number = 0;
  mode: CropMode = CropMode.Cover;
  width: number = 0;

  constructor(options?: CropOptions | string) {
    let resolved: CropOptions;
    if (typeof options === 'string') {
      resolved = parseConfig<CropOptions>(cropOptions())(options);
    } else if (options) {
      resolved = options;
    } else {
      resolved = {};
    }

    Object.assign(this, defaultOptions, resolved);
  }

  apply(mask: HTMLElement, image: HTMLElement): CropResult {
    const result = this.getCrop(mask.offsetWidth, mask.offsetHeight);
    const { left, top, width, height, forcedHeight, forcedWidth } = result;

    image.style.left = `${Math.floor(left)}px`;
    image.style.top = `${Math.floor(top)}px`;
    image.style.width = `${Math.ceil(width)}px`;
    image.style.height = `${Math.ceil(height)}px`;

    if (!this.disableMaskResize) {
      mask.style.width = forcedWidth == null ? '' : `${forcedWidth}px`;
      mask.style.height = forcedHeight == null ? '' : `${forcedHeight}px`;
    }

    return result;
  }

  getImageDimensions(maskWidth: number, maskHeight: number): DimensionsType {
    const { mode, height, width, maxScale, minScale } = this;
    let scale = 1;

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
        top = shift(maskHeight, height, focusY, true);
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
}
