import { __decorate, __extends } from "tslib";
import { attr } from '../../../utils/dom/attr';
import { event } from '../../../core/decorators/event';
import { toInt } from '../../../utils/lang/number/toInt';
import { Url } from '../../../utils/types/Url';
import { BehaviourModifier, } from '../BehaviourModifier';
var PageModifier = /** @class */ (function (_super) {
    __extends(PageModifier, _super);
    function PageModifier(view, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, view, options) || this;
        _this.value = 1;
        var _a = options.paramName, paramName = _a === void 0 ? 'page' : _a;
        _this.paramName = paramName;
        return _this;
    }
    PageModifier.prototype.getParams = function () {
        var _a;
        var _b = this, paramName = _b.paramName, value = _b.value;
        return _a = {},
            _a[paramName] = value > 1 ? "" + value : null,
            _a;
    };
    PageModifier.prototype.getUrl = function (page) {
        var _a;
        var _b = this, paramName = _b.paramName, view = _b.view;
        return view.getUrl((_a = {},
            _a[paramName] = page > 1 ? "" + page : null,
            _a));
    };
    PageModifier.prototype.setPage = function (value) {
        if (this.value !== value) {
            this.value = value;
            this.view.commit();
        }
    };
    PageModifier.prototype.softReset = function () {
        this.setPage(1);
    };
    PageModifier.prototype.sync = function (_a) {
        var url = _a.url;
        var page = url.getParam(this.paramName, '1');
        var value = parseInt(page);
        if (this.value === value) {
            return false;
        }
        this.value = value;
        return true;
    };
    // Protected methods
    // -----------------
    PageModifier.prototype.onPageClick = function (event) {
        var href = attr(event.current, 'href') || '';
        var page = toInt(Url.create(href).getParam(this.paramName, '1'));
        this.setPage(page);
        event.preventDefault();
    };
    __decorate([
        event({ name: 'click', selector: '*[data-filter-page]' })
    ], PageModifier.prototype, "onPageClick", null);
    return PageModifier;
}(BehaviourModifier));
export { PageModifier };
