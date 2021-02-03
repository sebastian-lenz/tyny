import { __assign, __extends, __spreadArrays } from "tslib";
import { emitUpdate } from './components/components';
import { fastDom } from './components';
import { find, findAll } from '../utils/dom/node/find';
import { isEmpty } from '../utils/lang/misc/isEmpty';
import { Lifecycle } from './Lifecycle';
import { Params } from './Params';
import { removeNode } from '../utils/dom/node/removeNode';
import { trigger } from '../utils/dom/event/trigger';
import { within } from '../utils/dom/node/within';
import { createElement, } from '../utils/dom/node/createElement';
var uid = 0;
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this._behaviours = [];
        var _a = _this._component, extraClassName = _a.className, name = _a.name;
        var el = options.el || createElement(__assign(__assign({}, options), { extraClassName: extraClassName }));
        var views = el.__tynyViews || (el.__tynyViews = {});
        if (name in views) {
            throw new Error("View " + name + " already exists on target.");
        }
        else {
            views[name] = _this;
        }
        _this.el = el;
        _this.params = new Params(_this, options);
        _this.uid = uid++;
        if (within(el, document)) {
            fastDom.read(_this._callConnected.bind(_this));
        }
        return _this;
    }
    Object.defineProperty(View.prototype, "behaviours", {
        get: function () {
            return __spreadArrays(this._behaviours);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(View.prototype, "component", {
        get: function () {
            return this._component;
        },
        enumerable: false,
        configurable: true
    });
    View.prototype.callUpdate = function (type) {
        if (type === void 0) { type = 'update'; }
        _super.prototype.callUpdate.call(this, type);
        this._behaviours.forEach(function (api) {
            return api.callUpdate(type);
        });
    };
    View.prototype.destroy = function (options) {
        var _a = this, el = _a.el, _component = _a._component;
        _super.prototype.destroy.call(this);
        if (el.__tynyViews) {
            delete el.__tynyViews[_component.name];
            if (isEmpty(el.__tynyViews)) {
                delete el.__tynyViews;
            }
        }
        if (options && options.remove) {
            removeNode(el);
        }
    };
    View.prototype.find = function (selector) {
        return find(selector, this.el);
    };
    View.prototype.findView = function (selector, ctor) {
        return this.findAllViews(selector, ctor)[0] || null;
    };
    View.prototype.findAll = function (selector) {
        return findAll(selector, this.el);
    };
    View.prototype.findAllViews = function (selector, ctor) {
        return findAll(selector, this.el).reduce(function (result, element) {
            var views = element.__tynyViews;
            if (!views)
                return result;
            for (var name_1 in views) {
                var view = views[name_1];
                if (view instanceof ctor) {
                    result.push(view);
                }
            }
            return result;
        }, []);
    };
    View.prototype.trigger = function (event, detail) {
        trigger(this.el, event, detail);
    };
    View.prototype.triggerUpdate = function (type) {
        emitUpdate(this.el, type);
    };
    // Protected methods
    // -----------------
    View.prototype.addBehaviour = function (ctor, options) {
        if (options === void 0) { options = {}; }
        var behaviour = new ctor(this, options);
        this._behaviours.push(behaviour);
        return behaviour;
    };
    // Lifecycle API
    // -------------
    View.prototype._callConnected = function () {
        _super.prototype._callConnected.call(this);
        this._behaviours.forEach(function (api) {
            return api._callConnected();
        });
        this.callUpdate();
    };
    View.prototype._callDisconnected = function () {
        _super.prototype._callDisconnected.call(this);
        this._behaviours.forEach(function (api) {
            return api._callDisconnected();
        });
    };
    return View;
}(Lifecycle));
export { View };
