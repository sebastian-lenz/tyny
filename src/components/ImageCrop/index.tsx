import cx from 'classnames';
import { JSX } from 'preact/jsx-runtime';

import { CropMode } from '../../views/ImageCrop/Crop';
import { Image } from '../Image';
import { ImageCrop as ImageCropView } from '../../views/ImageCrop';
import { registerView } from '../../core';

registerView('ImageCrop', ImageCropView);

export interface Props extends JSX.HTMLAttributes<HTMLImageElement> {
  focusX?: number;
  focusY?: number;
  mode?: CropMode
}

export function ImageCrop({ className, focusX, focusY, mode, ...props }: Props) {
  return (
    <div 
      class={cx(ImageCropView.prototype.component.className, className)} 
      data-focus-x={focusX}
      data-focus-y={focusY}
      data-mode={mode}
    >
      <Image {...props} />
    </div>
  );
}
