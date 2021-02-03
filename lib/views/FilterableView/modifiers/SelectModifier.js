import { __decorate, __extends } from "tslib";
import { event, property } from '../../../core';
import { ViewModifier } from '../ViewModifier';
var SelectModifier = /** @class */ (function (_super) {
    __extends(SelectModifier, _super);
    function SelectModifier(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this.value = '';
        return _this;
    }
    Object.defineProperty(SelectModifier.prototype, "paramName", {
        get: function () {
            return this.el.name;
        },
        enumerable: false,
        configurable: true
    });
    SelectModifier.prototype.getValue = function () {
        var selectedOptions = this.el.selectedOptions;
        var result = [];
        for (var index = 0; index < selectedOptions.length; index++) {
            var option = selectedOptions[index];
            if (option.value) {
                result.push(option.value);
            }
        }
        return result.length ? result.sort().join(',') : null;
    };
    SelectModifier.prototype.getParams = function () {
        var _a;
        return _a = {},
            _a[this.paramName] = this.getValue(),
            _a;
    };
    SelectModifier.prototype.setValue = function (value, silent) {
        var values = value ? value.split(',').sort() : [];
        if (values.join(',') === this.getValue()) {
            return;
        }
        var options = this.el.options;
        for (var index = 0; index < options.length; index++) {
            var option = options[index];
            option.selected = values.indexOf(option.value) !== -1;
        }
        if (!silent) {
            this.onChange();
        }
    };
    SelectModifier.prototype.sync = function (_a) {
        var url = _a.url;
        var value = url.getParam(this.paramName);
        if (this.getValue() === value) {
            return false;
        }
        this.setValue(value, true);
        return true;
    };
    SelectModifier.prototype.onChange = function () {
        var _a = this, triggerSoftReset = _a.triggerSoftReset, target = _a.target;
        if (target) {
            if (triggerSoftReset)
                target.softReset();
            target.commit();
        }
    };
    __decorate([
        property({ param: { type: 'string' } })
    ], SelectModifier.prototype, "defaultValue", void 0);
    __decorate([
        property({ param: { defaultValue: true, type: 'bool' } })
    ], SelectModifier.prototype, "triggerSoftReset", void 0);
    __decorate([
        property({ param: { type: 'string' } })
    ], SelectModifier.prototype, "paramName", null);
    __decorate([
        event({ name: 'change' })
    ], SelectModifier.prototype, "onChange", null);
    return SelectModifier;
}(ViewModifier));
export { SelectModifier };
