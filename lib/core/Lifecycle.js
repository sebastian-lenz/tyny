import { __assign, __rest } from "tslib";
import { fastDom } from './components';
import { isEqual } from '../utils/lang/object/isEqual';
import { isFunction } from '../utils/lang/function/isFunction';
import { isString } from '../utils/lang/string';
import { on } from '../utils/dom/event/on';
var Lifecycle = /** @class */ (function () {
    function Lifecycle() {
        this._eventListeners = null;
        this._isConnected = false;
        this._updatesTasks = null;
        this._watchTask = null;
        this._watchValues = null;
    }
    Object.defineProperty(Lifecycle.prototype, "isConnected", {
        get: function () {
            return this._isConnected;
        },
        enumerable: false,
        configurable: true
    });
    Lifecycle.prototype.callUpdate = function (type) {
        var _this = this;
        if (type === void 0) { type = 'update'; }
        if (type === 'update' || type === 'resize') {
            this._watch();
        }
        var updates = Object.values(this._updates);
        if (!updates.length) {
            return;
        }
        var tasks = this._updatesTasks || (this._updatesTasks = []);
        updates.forEach(function (_a, index) {
            var events = _a.events, handler = _a.handler, mode = _a.mode;
            if (tasks[index] || !events.includes(type)) {
                return;
            }
            tasks[index] = fastDom[mode](function () {
                if (_this.isConnected) {
                    var result = _this[handler].call(_this, type);
                    if (typeof result === 'function') {
                        fastDom.writes.push(result.bind(_this));
                    }
                }
                tasks[index] = null;
            });
        });
    };
    Lifecycle.prototype.destroy = function () {
        this._callDisconnected();
        this.onDestroyed();
    };
    // Internal hooks
    // --------------
    Lifecycle.prototype.onConnected = function () { };
    Lifecycle.prototype.onDestroyed = function () { };
    Lifecycle.prototype.onDisconnected = function () { };
    // View API
    // --------
    Lifecycle.prototype._callConnected = function () {
        if (this._isConnected)
            return;
        this._isConnected = true;
        this._bindEvents();
        this.onConnected();
    };
    Lifecycle.prototype._callDisconnected = function () {
        if (!this._isConnected)
            return;
        this._isConnected = false;
        this._unbindEvents();
        this.onDisconnected();
    };
    // Private methods
    // ---------------
    Lifecycle.prototype._bindEvent = function (listeners, event) {
        var _this = this;
        var name = event.name, target = event.target, handler = event.handler, selector = event.selector, filter = event.filter, args = __rest(event, ["name", "target", "handler", "selector", "filter"]);
        target = isFunction(target) ? target.call(this) : target || this.el;
        if (Array.isArray(target)) {
            return target.reduce(function (listeners, target) { return _this._bindEvent(listeners, __assign(__assign({}, event), { target: target })); }, listeners);
        }
        if (target && (!filter || filter.call(this))) {
            listeners.push(on(target, name, this[handler], __assign(__assign({}, args), { selector: isFunction(selector) ? selector.call(this) : selector, scope: this })));
        }
        return listeners;
    };
    Lifecycle.prototype._bindEvents = function () {
        if (this._eventListeners) {
            this._unbindEvents();
        }
        var _events = Object.values(this._events);
        this._eventListeners = _events
            ? _events.reduce(this._bindEvent.bind(this), [])
            : null;
    };
    Lifecycle.prototype._unbindEvents = function () {
        var listeners = this._eventListeners;
        this._eventListeners = null;
        if (listeners) {
            listeners.forEach(function (unbind) { return unbind(); });
        }
    };
    Lifecycle.prototype._watch = function () {
        var _this = this;
        var properties = Object.values(this._properties);
        if (this._watchTask || !properties.length) {
            return;
        }
        this._watchTask = fastDom.read(function () {
            if (_this._isConnected) {
                _this._watchWorker(properties);
            }
            _this._watchTask = null;
        });
    };
    Lifecycle.prototype._watchWorker = function (properties) {
        var isInitital = !this._watchValues;
        var values = this._watchValues || (this._watchValues = {});
        for (var index = 0; index < properties.length; index++) {
            var _a = properties[index], immediate = _a.immediate, immutable = _a.immutable, name_1 = _a.name, watch = _a.watch;
            if (immutable)
                continue;
            if (!watch) {
                delete values[name_1];
                continue;
            }
            var hasPrev = values.hasOwnProperty(name_1);
            var prev = values[name_1];
            delete values[name_1];
            if ((isInitital && immediate) ||
                (hasPrev && !isEqual(prev, this[name_1]))) {
                isString(watch)
                    ? this[watch](this[name_1], prev)
                    : watch.call(this, this[name_1], prev);
            }
        }
    };
    return Lifecycle;
}());
export { Lifecycle };
Object.assign(Lifecycle.prototype, {
    _events: {},
    _updates: {},
    _properties: {},
});
