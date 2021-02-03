import { __extends } from "tslib";
import { Image } from '../Image';
import { ZoomPanel } from '../ZoomPanel';
var ImageZoomPanel = /** @class */ (function (_super) {
    __extends(ImageZoomPanel, _super);
    function ImageZoomPanel(options) {
        var _this = _super.call(this, options) || this;
        _this.border = 50;
        var _a = options.border, border = _a === void 0 ? 50 : _a, _b = options.image, image = _b === void 0 ? '> *' : _b;
        _this.border = border;
        _this.image = _this.findView(image, Image);
        return _this;
    }
    ImageZoomPanel.prototype.draw = function () {
        var _a = this, border = _a.border, image = _a.image, position = _a.position, scale = _a.scale;
        if (!image)
            return;
        var el = image.el, naturalHeight = image.naturalHeight, naturalWidth = image.naturalWidth;
        var offset = border * scale;
        var height = naturalHeight * scale;
        var width = naturalWidth * scale;
        el.style.left = position.x + offset + "px";
        el.style.top = position.y + offset + "px";
        el.style.width = width + "px";
        el.style.height = height + "px";
    };
    ImageZoomPanel.prototype.getNativeHeight = function () {
        var _a = this, border = _a.border, image = _a.image;
        if (!image)
            return 0;
        return image.naturalHeight + 2 * border;
    };
    ImageZoomPanel.prototype.getNativeWidth = function () {
        var _a = this, border = _a.border, image = _a.image;
        if (!image)
            return 0;
        return image.naturalWidth + 2 * border;
    };
    return ImageZoomPanel;
}(ZoomPanel));
export default ImageZoomPanel;
