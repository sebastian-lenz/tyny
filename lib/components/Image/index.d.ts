import { JSX } from 'preact/jsx-runtime';
export interface Props extends JSX.ImgHTMLAttributes<HTMLImageElement> {
}
export declare function Image({ className, srcset, ...props }: Props): JSX.Element;
