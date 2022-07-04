import { createViews } from '../../core';
import { Image } from '../Image';
import { ZoomPanel } from '../ZoomPanel';
export class ImageZoomPanel extends ZoomPanel {
    constructor(options) {
        super(options);
        this.border = 50;
        createViews(this.el);
        const { border = 50, image = '> *' } = options;
        this.border = border;
        this.image = this.findView(image, Image);
    }
    draw() {
        const { border, image, position, scale } = this;
        if (!image)
            return;
        const { el, naturalHeight, naturalWidth } = image;
        const offset = border * scale;
        const height = naturalHeight * scale;
        const width = naturalWidth * scale;
        el.style.left = `${position.x + offset}px`;
        el.style.top = `${position.y + offset}px`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
    }
    getNativeHeight() {
        const { border, image } = this;
        if (!image)
            return 0;
        return image.naturalHeight + 2 * border;
    }
    getNativeWidth() {
        const { border, image } = this;
        if (!image)
            return 0;
        return image.naturalWidth + 2 * border;
    }
}
