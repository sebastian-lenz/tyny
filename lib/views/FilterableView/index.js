import { __assign, __decorate, __extends, __spreadArrays } from "tslib";
import { BehaviourModifier } from './BehaviourModifier';
import { event, getChildViews, property } from '../../core';
import { fetch } from '../../utils/env/fetch';
import { Swap } from '../Swap';
import { Url } from '../../utils/types/Url';
import { ViewModifier } from './ViewModifier';
export var filterChangedEvent = 'tyny:filterChanged';
var FilterableView = /** @class */ (function (_super) {
    __extends(FilterableView, _super);
    function FilterableView(options) {
        var _this = _super.call(this, __assign(__assign({}, options), { autoAppend: true, autoRemove: true })) || this;
        //
        _this.skipSameUrl = true;
        _this.staticParams = {};
        _this._basePath = '';
        _this._hasChanges = false;
        _this._request = null;
        return _this;
    }
    Object.defineProperty(FilterableView.prototype, "modifiers", {
        get: function () {
            return __spreadArrays(this.behaviours.filter(function (b) { return b instanceof BehaviourModifier; }), getChildViews(this.el).filter(function (v) { return v instanceof ViewModifier; }));
        },
        enumerable: false,
        configurable: true
    });
    FilterableView.prototype.commit = function (_a) {
        var _this = this;
        var disableLoad = (_a === void 0 ? {} : _a).disableLoad;
        if (this._hasChanges)
            return;
        this._hasChanges = true;
        setTimeout(function () {
            var url = _this.getUrl();
            if (_this.skipSameUrl && window.location.href === url) {
                _this._hasChanges = false;
                return;
            }
            window.history.pushState(null, document.title, url);
            if (!disableLoad) {
                _this.load();
            }
            _this.trigger(filterChangedEvent, { target: _this });
            _this._hasChanges = false;
        }, 50);
    };
    FilterableView.prototype.getParams = function (overrides) {
        if (overrides === void 0) { overrides = {}; }
        return this.modifiers.reduce(function (params, modifier) { return (__assign(__assign({}, modifier.getParams()), params)); }, overrides);
    };
    FilterableView.prototype.getUrl = function (overrides, path) {
        if (overrides === void 0) { overrides = {}; }
        if (path === void 0) { path = this._basePath; }
        return Url.compose({
            path: path,
            query: this.getParams(overrides),
        });
    };
    FilterableView.prototype.softReset = function () {
        this.modifiers.forEach(function (modifier) { return modifier.softReset(); });
    };
    FilterableView.prototype.sync = function (silent) {
        if (silent === void 0) { silent = false; }
        var modifiers = this.modifiers;
        var url = new Url(window.location.href);
        var hasChanged = modifiers.reduce(function (hasChanged, modifier) { return modifier.sync({ silent: silent, url: url }) || hasChanged; }, false);
        if (!this._basePath) {
            this._basePath = url.path;
        }
        if (hasChanged && !silent) {
            this.load();
            this.trigger(filterChangedEvent, { target: this });
        }
    };
    // Protected methods
    // -----------------
    FilterableView.prototype.createRequest = function () {
        var responseCache = FilterableView.responseCache;
        var url = this.getUrl(this.staticParams, this._fetchPath);
        if (url in responseCache) {
            return Promise.resolve(responseCache[url]);
        }
        return fetch(url)
            .then(function (response) { return response.text(); })
            .then(function (html) { return (responseCache[url] = html); });
    };
    FilterableView.prototype.load = function () {
        var _this = this;
        var request = (this._request = this.createRequest().then(function (result) {
            if (_this._request !== request)
                return;
            _this._request = null;
            if (result === null) {
                _this.setContent(null);
            }
            else if (result !== false) {
                var parser = new DOMParser();
                var document_1 = parser.parseFromString(result, 'text/html');
                _this.setContent(document_1.body.firstElementChild);
            }
        }));
    };
    FilterableView.prototype.onConnected = function () {
        this.sync(true);
    };
    FilterableView.prototype.onPopState = function () {
        this.sync();
    };
    FilterableView.responseCache = {};
    __decorate([
        property()
    ], FilterableView.prototype, "modifiers", null);
    __decorate([
        event({ name: 'popstate', target: window })
    ], FilterableView.prototype, "onPopState", null);
    return FilterableView;
}(Swap));
export { FilterableView };
