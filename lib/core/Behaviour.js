import { __extends } from "tslib";
import { Lifecycle } from './Lifecycle';
var Behaviour = /** @class */ (function (_super) {
    __extends(Behaviour, _super);
    function Behaviour(view, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.view = view;
        return _this;
    }
    Object.defineProperty(Behaviour.prototype, "el", {
        get: function () {
            return this.view.el;
        },
        enumerable: false,
        configurable: true
    });
    Behaviour.prototype.onConnected = function () { };
    Behaviour.prototype.onDestroyed = function () { };
    Behaviour.prototype.onDisconnected = function () { };
    return Behaviour;
}(Lifecycle));
export { Behaviour };
