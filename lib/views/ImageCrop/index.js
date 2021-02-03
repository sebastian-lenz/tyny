import { __decorate } from "tslib";
import { Crop } from './Crop';
import { data } from '../../utils/dom/attr/data';
import { View, update, property, getView } from '../../core';
export class ImageCrop extends View {
    constructor(options = {}) {
        super(options);
        //
        this.currentCrop = null;
        this.displayHeight = Number.NaN;
        this.displayWidth = Number.NaN;
        this.crop = Crop.create(this, options);
    }
    forceDraw() {
        this.onSizeChanged();
    }
    getDisplaySize() {
        const { el } = this;
        return {
            height: el.offsetHeight,
            width: el.offsetWidth,
        };
    }
    onMeasure() {
        const { height, width } = this.getDisplaySize();
        if (this.displayHeight !== height || this.displayWidth !== width) {
            this.displayHeight = height;
            this.displayWidth = width;
            return this.onSizeChanged;
        }
    }
    onSizeChanged() {
        const { crop, target } = this;
        if (!target) {
            return;
        }
        const image = getView(target, 'Image');
        if (image) {
            crop.height = image.naturalHeight;
            crop.width = image.naturalWidth;
        }
        else {
            crop.height = parseFloat(data(target, 'height') || '0');
            crop.width = parseFloat(data(target, 'width') || '0');
        }
        this.currentCrop = crop.apply(this.el, target, this.displayWidth, this.displayHeight);
    }
}
__decorate([
    property({ param: { defaultValue: '> img', type: 'element' } })
], ImageCrop.prototype, "target", void 0);
__decorate([
    update({ events: ['resize', 'update'], mode: 'read' })
], ImageCrop.prototype, "onMeasure", null);
