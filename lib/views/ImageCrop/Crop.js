import { __assign } from "tslib";
export var CropMode;
(function (CropMode) {
    CropMode[CropMode["Cover"] = 0] = "Cover";
    CropMode[CropMode["Fit"] = 1] = "Fit";
    CropMode[CropMode["FitColumn"] = 2] = "FitColumn";
    CropMode[CropMode["Stretch"] = 3] = "Stretch";
    CropMode[CropMode["Width"] = 4] = "Width";
    CropMode[CropMode["Height"] = 5] = "Height";
})(CropMode || (CropMode = {}));
function shift(space, size, focus, invert) {
    if (invert)
        focus = 1 - focus;
    var shift = Math.round(-size * focus + space / 2);
    // if (space < size) {
    if (shift > 0)
        shift = 0;
    if (shift < space - size)
        shift = space - size;
    // }
    return shift;
}
var defaultOptions = {
    disableMaskResize: false,
    focusY: 0.5,
    focusX: 0.5,
    height: 0,
    maxScale: Number.MAX_VALUE,
    minScale: 0,
    mode: CropMode.Cover,
    width: 0,
};
var Crop = /** @class */ (function () {
    function Crop(options) {
        this.disableMaskResize = false;
        this.focusX = 0.5;
        this.focusY = 0.5;
        this.height = 0;
        this.maxScale = Number.MAX_VALUE;
        this.minScale = 0;
        this.mode = CropMode.Cover;
        this.width = 0;
        var resolved;
        if (options) {
            resolved = options;
        }
        else {
            resolved = {};
        }
        Object.assign(this, defaultOptions, resolved);
    }
    Crop.prototype.apply = function (mask, image, maskWidth, maskHeight) {
        if (maskWidth === void 0) { maskWidth = NaN; }
        if (maskHeight === void 0) { maskHeight = NaN; }
        if (isNaN(maskWidth))
            maskWidth = mask.offsetWidth;
        if (isNaN(maskHeight))
            maskHeight = mask.offsetHeight;
        var result = this.getCrop(maskWidth, maskHeight);
        var left = result.left, top = result.top, width = result.width, height = result.height, forcedHeight = result.forcedHeight, forcedWidth = result.forcedWidth;
        var style = image.style;
        style.left = Math.floor(left) + "px";
        style.top = Math.floor(top) + "px";
        style.width = Math.ceil(width) + "px";
        style.height = Math.ceil(height) + "px";
        if (!this.disableMaskResize) {
            mask.style.width = forcedWidth == null ? '' : forcedWidth + "px";
            mask.style.height = forcedHeight == null ? '' : forcedHeight + "px";
        }
        return result;
    };
    Crop.prototype.clone = function (options) {
        if (options === void 0) { options = {}; }
        return new Crop(__assign(__assign({}, this.toOptions), options));
    };
    Crop.prototype.getImageDimensions = function (maskWidth, maskHeight) {
        var scale = 1;
        var _a = this, mode = _a.mode, height = _a.height, width = _a.width, maxScale = _a.maxScale, minScale = _a.minScale;
        switch (mode) {
            case CropMode.Stretch:
                return {
                    width: maskWidth,
                    height: maskHeight,
                };
            case CropMode.Cover:
                scale = Math.max(maskWidth / width, maskHeight / height);
                break;
            case CropMode.Fit:
            case CropMode.FitColumn:
                scale = Math.min(maskWidth / width, maskHeight / height);
                break;
            case CropMode.Width:
                scale = maskWidth / width;
                break;
            case CropMode.Height:
                scale = maskHeight / height;
                break;
        }
        if (scale > maxScale)
            scale = maxScale;
        if (scale < minScale)
            scale = minScale;
        return {
            width: width * scale,
            height: height * scale,
        };
    };
    Crop.prototype.getCrop = function (maskWidth, maskHeight) {
        var _a = this, focusX = _a.focusX, focusY = _a.focusY, mode = _a.mode;
        var _b = this.getImageDimensions(maskWidth, maskHeight), width = _b.width, height = _b.height;
        var left = 0;
        var top = 0;
        var forcedHeight;
        var forcedWidth;
        switch (mode) {
            case CropMode.Cover:
                left = shift(maskWidth, width, focusX);
                top = shift(maskHeight, height, focusY);
                break;
            case CropMode.FitColumn:
                forcedHeight = height;
                forcedWidth = width;
                break;
            case CropMode.Fit:
                left = (maskWidth - width) * focusX;
                top = (maskHeight - height) * focusY;
                break;
            case CropMode.Width:
                forcedHeight = height;
                break;
            case CropMode.Height:
                forcedWidth = width;
                break;
        }
        return {
            left: left,
            top: top,
            width: width,
            height: height,
            forcedHeight: forcedHeight,
            forcedWidth: forcedWidth,
        };
    };
    Crop.prototype.toOptions = function () {
        return {
            disableMaskResize: this.disableMaskResize,
            focusY: this.focusY,
            focusX: this.focusX,
            maxScale: this.maxScale,
            minScale: this.minScale,
            mode: this.mode,
        };
    };
    Crop.create = function (view, _a) {
        var crop = _a.crop;
        if (crop instanceof Crop) {
            return crop;
        }
        return crop ? new Crop(crop) : Crop.fromParams(view.params);
    };
    Crop.fromParams = function (params) {
        return new Crop({
            disableMaskResize: params.bool({
                name: 'disableMaskResize',
                defaultValue: false,
            }),
            focusY: params.number({ name: 'focusY', defaultValue: 0.5 }),
            focusX: params.number({ name: 'focusX', defaultValue: 0.5 }),
            maxScale: params.number({
                name: 'maxScale',
                defaultValue: Number.MAX_VALUE,
            }),
            minScale: params.number({ name: 'minScale', defaultValue: 0 }),
            mode: params.enum({
                name: 'mode',
                enum: CropMode,
                defaultValue: CropMode.Cover,
            }),
        });
    };
    return Crop;
}());
export { Crop };
