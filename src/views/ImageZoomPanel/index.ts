import { property } from '../../core';
import { Image } from '../Image';
import { ZoomPanel, ZoomPanelOptions } from '../ZoomPanel';

export interface ImageZoomPanelOptions extends ZoomPanelOptions {
  border?: number;
  image?: string;
}

export default class ImageZoomPanel extends ZoomPanel {
  border: number = 50;
  readonly image: Image | null;

  constructor(options: ImageZoomPanelOptions) {
    super(options);

    const { border = 50, image = '> *' } = options;
    this.border = border;
    this.image = this.findView(image, Image);
  }

  draw(): void {
    const { border, image, position, scale } = this;
    if (!image) return;

    const { el, naturalHeight, naturalWidth } = image;
    const offset = border * scale;
    const height = naturalHeight * scale;
    const width = naturalWidth * scale;

    el.style.left = `${position.x + offset}px`;
    el.style.top = `${position.y + offset}px`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
  }

  getNativeHeight(): number {
    const { border, image } = this;
    if (!image) return 0;

    return image.naturalHeight + 2 * border;
  }

  getNativeWidth(): number {
    const { border, image } = this;
    if (!image) return 0;

    return image.naturalWidth + 2 * border;
  }
}
