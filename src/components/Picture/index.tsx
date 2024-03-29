import cx from 'classnames';
import { JSX } from 'preact/jsx-runtime';

import { Picture as PictureView } from '../../views/Picture';
import { registerView } from '../../core';

registerView('Picture', PictureView);

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

export function Picture({
  className,
  focusX,
  focusY,
  sources,
  ...props
}: Props) {
  return (
    <picture
      {...props}
      className={cx(PictureView.prototype.component.className, className)}
      data-focus-x={focusX}
      data-focus-y={focusY}
    >
      <canvas />
      {sources.map((source, index) => (
        <source {...source} key={index} />
      ))}
    </picture>
  );
}
