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
    let shift = Math.round(-size * focus + space / 2);
    // if (space < size) {
    if (shift > 0)
        shift = 0;
    if (shift < space - size)
        shift = space - size;
    // }
    return shift;
}
const defaultOptions = {
    disableMaskResize: false,
    focusY: 0.5,
    focusX: 0.5,
    height: 0,
    maxScale: Number.MAX_VALUE,
    minScale: 0,
    mode: CropMode.Cover,
    width: 0,
};
export class Crop {
    constructor(options) {
        this.disableMaskResize = false;
        this.focusX = 0.5;
        this.focusY = 0.5;
        this.height = 0;
        this.maxScale = Number.MAX_VALUE;
        this.minScale = 0;
        this.mode = CropMode.Cover;
        this.width = 0;
        let resolved;
        if (options) {
            resolved = options;
        }
        else {
            resolved = {};
        }
        Object.assign(this, defaultOptions, resolved);
    }
    apply(mask, image, maskWidth = NaN, maskHeight = NaN) {
        if (isNaN(maskWidth))
            maskWidth = mask.offsetWidth;
        if (isNaN(maskHeight))
            maskHeight = mask.offsetHeight;
        const result = this.getCrop(maskWidth, maskHeight);
        const { left, top, width, height, forcedHeight, forcedWidth } = result;
        const { style } = image;
        style.left = `${Math.floor(left)}px`;
        style.top = `${Math.floor(top)}px`;
        style.width = `${Math.ceil(width)}px`;
        style.height = `${Math.ceil(height)}px`;
        if (!this.disableMaskResize) {
            mask.style.width = forcedWidth == null ? '' : `${forcedWidth}px`;
            mask.style.height = forcedHeight == null ? '' : `${forcedHeight}px`;
        }
        return result;
    }
    clone(options = {}) {
        return new Crop(Object.assign(Object.assign({}, this.toOptions), options));
    }
    getImageDimensions(maskWidth, maskHeight) {
        let scale = 1;
        const { mode, height, width, maxScale, minScale } = this;
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
    }
    getCrop(maskWidth, maskHeight) {
        const { focusX, focusY, mode } = this;
        let { width, height } = this.getImageDimensions(maskWidth, maskHeight);
        let left = 0;
        let top = 0;
        let forcedHeight;
        let forcedWidth;
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
            left,
            top,
            width,
            height,
            forcedHeight,
            forcedWidth,
        };
    }
    toOptions() {
        return {
            disableMaskResize: this.disableMaskResize,
            focusY: this.focusY,
            focusX: this.focusX,
            maxScale: this.maxScale,
            minScale: this.minScale,
            mode: this.mode,
        };
    }
    static create(view, { crop }) {
        if (crop instanceof Crop) {
            return crop;
        }
        return crop ? new Crop(crop) : Crop.fromParams(view.params);
    }
    static fromParams(params) {
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
    }
}
