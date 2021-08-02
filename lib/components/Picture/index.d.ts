import { JSX } from 'preact/jsx-runtime';
export interface PictureSource {
    height: number;
    srcset: string;
    width: number;
}
export interface Props extends JSX.HTMLAttributes<HTMLPictureElement> {
    focusX?: number;
    focusY?: number;
    sources: Array<PictureSource>;
}
export declare function Picture({ className, focusX, focusY, sources, ...props }: Props): JSX.Element;
