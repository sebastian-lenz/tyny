import { __decorate, __extends } from "tslib";
import { property, update, View } from '../../core';
import { once } from '../../utils/dom/event/once';
import { SourceSet } from './SourceSet';
import { visibility } from '../../services/visibility';
import { attr } from '../../utils/dom/attr';
import { toInt } from '../../utils/lang/number/toInt';
var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.currentSource = '';
        _this.displayHeight = 0;
        _this.displayWidth = 0;
        _this.isLoaded = false;
        _this.isVisible = false;
        _this.naturalHeight = 0;
        _this.naturalWidth = 0;
        _this.naturalHeight = toInt(attr(_this.el, 'height'));
        _this.naturalWidth = toInt(attr(_this.el, 'width'));
        return _this;
    }
    Object.defineProperty(Image.prototype, "promise", {
        get: function () {
            var _this = this;
            return new Promise(function (resolve) {
                var el = _this.el;
                el.complete ? resolve() : once(el, 'load', function () { return resolve(); });
            }).then(function () {
                var el = _this.el;
                el.classList.add('loaded');
                _this.isLoaded = true;
                if (el.naturalHeight !== 0 && el.naturalWidth !== 0) {
                    _this.naturalHeight = el.naturalHeight;
                    _this.naturalWidth = el.naturalWidth;
                }
            });
        },
        enumerable: false,
        configurable: true
    });
    Image.prototype.load = function () {
        this.isVisible = true;
        this.update();
        return this.promise;
    };
    Image.prototype.setSource = function (value) {
        if (this.currentSource === value)
            return;
        this.currentSource = value;
        this.promise;
        this.el.src = value;
    };
    Image.prototype.setVisible = function (value) {
        this.isVisible = value;
        if (value)
            this.update();
    };
    Image.prototype.update = function () {
        var _this = this;
        var _a = this, displayWidth = _a.displayWidth, isVisible = _a.isVisible, sourceSet = _a.sourceSet;
        if (isVisible) {
            sourceSet.get(displayWidth).then(function (source) { return _this.setSource(source); });
        }
    };
    Image.prototype.onConnected = function () {
        _super.prototype.onConnected.call(this);
        visibility.observe(this);
    };
    Image.prototype.onDisconnected = function () {
        _super.prototype.onDisconnected.call(this);
        visibility.unobserve(this);
    };
    Image.prototype.onResize = function () {
        var _a = this, displayHeight = _a.displayHeight, displayWidth = _a.displayWidth, el = _a.el;
        var height = (this.displayHeight = el.clientHeight);
        var width = (this.displayWidth = el.clientWidth);
        if (displayHeight !== height || displayWidth !== width) {
            return this.update;
        }
    };
    __decorate([
        property({ immutable: true })
    ], Image.prototype, "promise", null);
    __decorate([
        property({
            immutable: true,
            param: { ctor: SourceSet, type: 'instance', attribute: 'data-srcset' },
        })
    ], Image.prototype, "sourceSet", void 0);
    __decorate([
        update({ events: ['resize', 'update'], mode: 'read' })
    ], Image.prototype, "onResize", null);
    return Image;
}(View));
export { Image };
