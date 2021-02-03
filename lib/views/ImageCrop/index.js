import { __decorate, __extends } from "tslib";
import { Crop } from './Crop';
import { data } from '../../utils/dom/attr/data';
import { View, update, property, getView } from '../../core';
var ImageCrop = /** @class */ (function (_super) {
    __extends(ImageCrop, _super);
    function ImageCrop(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        //
        _this.currentCrop = null;
        _this.displayHeight = Number.NaN;
        _this.displayWidth = Number.NaN;
        _this.crop = Crop.create(_this, options);
        return _this;
    }
    ImageCrop.prototype.forceDraw = function () {
        this.onSizeChanged();
    };
    ImageCrop.prototype.getDisplaySize = function () {
        var el = this.el;
        return {
            height: el.offsetHeight,
            width: el.offsetWidth,
        };
    };
    ImageCrop.prototype.onMeasure = function () {
        var _a = this.getDisplaySize(), height = _a.height, width = _a.width;
        if (this.displayHeight !== height || this.displayWidth !== width) {
            this.displayHeight = height;
            this.displayWidth = width;
            return this.onSizeChanged;
        }
    };
    ImageCrop.prototype.onSizeChanged = function () {
        var _a = this, crop = _a.crop, target = _a.target;
        if (!target) {
            return;
        }
        var image = getView(target, 'Image');
        if (image) {
            crop.height = image.naturalHeight;
            crop.width = image.naturalWidth;
        }
        else {
            crop.height = parseFloat(data(target, 'height') || '0');
            crop.width = parseFloat(data(target, 'width') || '0');
        }
        this.currentCrop = crop.apply(this.el, target, this.displayWidth, this.displayHeight);
    };
    __decorate([
        property({ param: { defaultValue: '> img', type: 'element' } })
    ], ImageCrop.prototype, "target", void 0);
    __decorate([
        update({ events: ['resize', 'update'], mode: 'read' })
    ], ImageCrop.prototype, "onMeasure", null);
    return ImageCrop;
}(View));
export { ImageCrop };
