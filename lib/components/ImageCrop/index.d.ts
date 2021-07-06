import { JSX } from 'preact/jsx-runtime';
import { CropMode } from '../../views/ImageCrop/Crop';
export interface Props extends JSX.HTMLAttributes<HTMLImageElement> {
    focusX?: number;
    focusY?: number;
    mode?: CropMode;
}
export declare function ImageCrop({ className, focusX, focusY, mode, ...props }: Props): JSX.Element;
