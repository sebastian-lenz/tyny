import cx from 'classnames';
import { JSX } from 'preact/jsx-runtime';

import { Image as ImageView } from '../../views/Image';
import { registerView } from '../../core';

registerView('Image', ImageView);

export interface Props extends JSX.ImgHTMLAttributes<HTMLImageElement> {}

export function Image({ className, srcset, ...props }: Props) {
  return (
    <img
      {...props}
      className={cx(ImageView.prototype.component.className, className)}
      data-srcset={srcset}
    />
  );
}
