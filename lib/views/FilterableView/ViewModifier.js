import { __decorate, __extends } from "tslib";
import { FilterableView } from './index';
import { getParentView, property, View } from '../../core';
var ViewModifier = /** @class */ (function (_super) {
    __extends(ViewModifier, _super);
    function ViewModifier(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, options) || this;
    }
    Object.defineProperty(ViewModifier.prototype, "target", {
        get: function () {
            return getParentView(this.el, FilterableView);
        },
        enumerable: false,
        configurable: true
    });
    ViewModifier.prototype.softReset = function () { };
    __decorate([
        property()
    ], ViewModifier.prototype, "target", null);
    return ViewModifier;
}(View));
export { ViewModifier };
