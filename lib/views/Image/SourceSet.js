import { __assign } from "tslib";
import { supportsWebp } from '../../utils/env/webp';
var sourceSetRegExp = /([^ ]+) (\d+)([WwXx])/;
export var SourceSetMode;
(function (SourceSetMode) {
    SourceSetMode[SourceSetMode["Width"] = 0] = "Width";
    SourceSetMode[SourceSetMode["Density"] = 1] = "Density";
})(SourceSetMode || (SourceSetMode = {}));
var SourceSet = /** @class */ (function () {
    function SourceSet(data) {
        var _this = this;
        this.mode = null;
        this.sources = [];
        if (Array.isArray(data)) {
            data.forEach(function (source) { return _this.add(source); });
        }
        else if (typeof data === 'number') {
            this.mode = data;
        }
        else if (typeof data === 'string') {
            this.parse(data);
        }
        this.webpCheck = this.sources.some(function (source) { return source.isWebp; })
            ? supportsWebp().then(function (hasWebp) {
                if (!hasWebp) {
                    _this.sources = _this.sources.filter(function (source) { return !source.isWebp; });
                }
            })
            : Promise.resolve();
    }
    SourceSet.prototype.add = function (source) {
        var _a = this, currentMode = _a.mode, sources = _a.sources;
        var safeSource = __assign({ bias: Number.MAX_VALUE, isWebp: /\.webp$/.test(source.src) }, source);
        var mode = safeSource.mode;
        if (mode != void 0) {
            if (!currentMode) {
                this.mode = mode;
            }
            else if (currentMode !== mode) {
                console.warn('Mismatched image srcSet, all sources must use same mode.');
                return;
            }
        }
        sources.push(safeSource);
        sources.sort(function (a, b) { return a.bias - b.bias; });
    };
    SourceSet.prototype.get = function (width) {
        var _this = this;
        return this.webpCheck.then(function () {
            var _a = _this, mode = _a.mode, sources = _a.sources;
            var count = sources.length;
            if (count === 0) {
                return '';
            }
            var threshold = window.devicePixelRatio ? window.devicePixelRatio : 1;
            if (mode === SourceSetMode.Width) {
                threshold = width * threshold;
            }
            for (var index = 0; index < sources.length; index++) {
                var source = sources[index];
                if (source.bias >= threshold) {
                    return source.src;
                }
            }
            return sources[count - 1].src;
        });
    };
    SourceSet.prototype.parse = function (rawValue) {
        var _this = this;
        rawValue.split(/,/).forEach(function (src) {
            src = src.trim();
            var match = sourceSetRegExp.exec(src);
            if (match) {
                _this.add({
                    src: match[1],
                    bias: parseFloat(match[2]),
                    mode: match[3] === 'W' || match[3] === 'w'
                        ? SourceSetMode.Width
                        : SourceSetMode.Density,
                });
            }
            else {
                _this.add({ src: src });
            }
        });
    };
    return SourceSet;
}());
export { SourceSet };
