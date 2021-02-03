import { __assign, __decorate, __extends } from "tslib";
import { Crop } from '../ImageCrop/Crop';
import { data } from '../../utils/dom/attr';
import { property, update, View } from '../../core';
import { Source } from './Source';
import { tween } from '../../fx/tween';
import { visibility } from '../../services/visibility';
function renderImage(ctx, _a, maskWidth, maskHeight) {
    var image = _a.image, source = _a.source;
    var crop = source.getCrop(maskWidth, maskHeight);
    ctx.drawImage(image, crop.left, crop.top, crop.width, crop.height);
}
var Picture = /** @class */ (function (_super) {
    __extends(Picture, _super);
    function Picture(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.currentImage = null;
        _this.displayHeight = 0;
        _this.displayWidth = 0;
        _this.images = {};
        _this.isVisible = false;
        _this.nextImage = null;
        _this.progress = 0;
        var crop = Crop.create(_this, options).toOptions();
        _this.sources = _this.findAll('source').map(function (source) {
            return new Source(__assign(__assign({}, crop), { height: parseInt(data(source, 'height') || '0'), sourceSet: data(source, 'srcset') || '', width: parseInt(data(source, 'width') || '0') }));
        });
        return _this;
    }
    Picture.prototype.setVisible = function (value) {
        if (this.isVisible === value)
            return;
        this.isVisible = value;
        if (value && !this.displayWidth) {
            this.triggerUpdate('resize');
        }
        else {
            this.updateImage();
        }
    };
    Picture.prototype.findSource = function (width, height) {
        if (width === void 0) { width = this.displayWidth; }
        if (height === void 0) { height = this.displayHeight; }
        var sources = this.sources;
        var aspect = height / width;
        var bestSource = null;
        var bestScore = Number.MAX_VALUE;
        for (var index = 0; index < sources.length; index++) {
            var source = sources[index];
            var sourceAspect = source.height / source.width;
            var score = Math.abs(aspect - sourceAspect) +
                (source.height < height || source.width < width ? 10 : 0);
            if (score < bestScore) {
                bestSource = source;
                bestScore = score;
            }
        }
        return bestSource;
    };
    Picture.prototype.getImage = function (source, url) {
        var _this = this;
        var images = this.images;
        if (!(url in images)) {
            var image = document.createElement('img');
            var item_1 = (images[url] = {
                image: image,
                isLoaded: false,
                source: source,
                url: url,
            });
            image.src = url;
            item_1.isLoaded = !!image.complete;
            image.addEventListener('load', function () {
                item_1.isLoaded = true;
                _this.tryTransist();
            });
        }
        return images[url];
    };
    Picture.prototype.onConnected = function () {
        _super.prototype.onConnected.call(this);
        visibility.observe(this);
    };
    Picture.prototype.onDisconnected = function () {
        _super.prototype.onDisconnected.call(this);
        visibility.unobserve(this);
    };
    Picture.prototype.onMeasure = function () {
        var _a = this, displayHeight = _a.displayHeight, displayWidth = _a.displayWidth, el = _a.el;
        var ratio = window.devicePixelRatio ? window.devicePixelRatio : 1;
        var height = el.clientHeight * ratio;
        var width = el.clientWidth * ratio;
        if (height !== displayHeight || width !== displayWidth) {
            this.displayHeight = height;
            this.displayWidth = width;
            this.updateImage();
            return this.onSizeChanged;
        }
    };
    Picture.prototype.onSizeChanged = function () {
        var _a = this, canvas = _a.canvas, displayHeight = _a.displayHeight, displayWidth = _a.displayWidth;
        if (canvas) {
            canvas.height = displayHeight;
            canvas.width = displayWidth;
        }
        this.render();
    };
    Picture.prototype.onTransitionEnd = function () {
        this.currentImage = this.nextImage;
        this.nextImage = null;
        this.progress = 0;
        this.updateImage();
        this.render();
    };
    Picture.prototype.render = function () {
        var _a = this, canvas = _a.canvas, currentImage = _a.currentImage, nextImage = _a.nextImage, progress = _a.progress;
        var ctx = canvas ? canvas.getContext('2d') : null;
        if (!ctx) {
            return;
        }
        var height = this.displayHeight;
        var width = this.displayWidth;
        ctx.clearRect(0, 0, width, height);
        if (currentImage) {
            ctx.globalAlpha = 1;
            renderImage(ctx, currentImage, width, height);
        }
        if (nextImage && progress) {
            ctx.globalAlpha = progress;
            renderImage(ctx, nextImage, width, height);
        }
    };
    Picture.prototype.setProgress = function (value) {
        this.progress = value;
        this.render();
    };
    Picture.prototype.tryTransist = function () {
        var _this = this;
        var _a = this, nextImage = _a.nextImage, progress = _a.progress;
        if (!nextImage || !nextImage.isLoaded || progress) {
            return;
        }
        tween(this, { progress: 1 }, { duration: 100 }).then(function () {
            _this.onTransitionEnd();
        });
    };
    Picture.prototype.updateImage = function () {
        var _this = this;
        var _a = this, currentImage = _a.currentImage, isVisible = _a.isVisible, nextImage = _a.nextImage, progress = _a.progress;
        var source = this.findSource();
        if (!source || !isVisible || (nextImage && progress))
            return;
        source.sourceSet.get(this.displayWidth).then(function (url) {
            var image = _this.getImage(source, url);
            if ((currentImage === image && !nextImage) || nextImage === image)
                return;
            _this.nextImage = image;
            _this.tryTransist();
        });
    };
    __decorate([
        property({
            immutable: true,
            param: { defaultValue: 'canvas', tagName: 'canvas', type: 'element' },
        })
    ], Picture.prototype, "canvas", void 0);
    __decorate([
        update({ events: 'resize', mode: 'read' })
    ], Picture.prototype, "onMeasure", null);
    return Picture;
}(View));
export { Picture };
