import { __decorate, __extends, __rest } from "tslib";
import { attr } from '../../utils/dom/attr';
import { event, property, update, View } from '../../core';
import { getWindowHeight } from '../../utils/dom/window';
import { template } from './template';
import { toArray } from '../../utils/lang/array/toArray';
var DropDown = /** @class */ (function (_super) {
    __extends(DropDown, _super);
    function DropDown(_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.groupLabel, groupLabel = _b === void 0 ? function (el) { return el.label; } : _b, _c = _a.optionLabel, optionLabel = _c === void 0 ? function (el) { return el.label; } : _c, _d = _a.selectedLabel, selectedLabel = _d === void 0 ? function (els) {
            return els.length ? els.map(function (el) { return el.label; }).join(', ') : '';
        } : _d, options = __rest(_a, ["groupLabel", "optionLabel", "selectedLabel"]);
        var _this = _super.call(this, options) || this;
        _this.el.tabIndex = 0;
        _this.groupLabel = groupLabel;
        _this.optionLabel = optionLabel;
        _this.selectedLabel = selectedLabel;
        return _this;
    }
    DropDown.prototype.onConnected = function () {
        this.renderFlyout();
    };
    DropDown.prototype.onElementChanged = function () {
        this.renderFlyout();
    };
    DropDown.prototype.onOptionClick = function (event) {
        this.toggleValue(attr(event.current, 'data-dropdown-value') || '');
        this.el.blur();
    };
    DropDown.prototype.onUpdate = function () {
        var flyout = this.flyout;
        var rect = this.el.getBoundingClientRect();
        var height = flyout.clientHeight;
        var viewHeight = getWindowHeight();
        return function () {
            flyout.classList.toggle('top', viewHeight - rect.bottom < height + 20);
        };
    };
    DropDown.prototype.onValueChanged = function () {
        this.renderLabel();
    };
    DropDown.prototype.renderFlyout = function () {
        var _a = this, component = _a.component, groupLabel = _a.groupLabel, optionLabel = _a.optionLabel, select = _a.select;
        this.flyout.innerHTML = select
            ? template({
                className: component.className,
                element: select,
                groupLabel: groupLabel,
                optionLabel: optionLabel,
            })
            : '';
        this.renderLabel();
    };
    DropDown.prototype.renderLabel = function () {
        var _a = this, label = _a.label, select = _a.select, selectedLabel = _a.selectedLabel;
        if (!select) {
            label.innerHTML = '';
            label.removeAttribute('data-dropdown-selected');
            return;
        }
        var selected = toArray(select.selectedOptions);
        var values = selected.map(function (option) { return option.value; });
        label.innerHTML = selectedLabel(selected);
        label.setAttribute('data-dropdown-selected', values.join(','));
        this.findAll("*[data-dropdown-value]").forEach(function (element) {
            return element.classList.toggle('selected', values.indexOf(attr(element, 'data-dropdown-value') || '') !== -1);
        });
    };
    DropDown.prototype.toggleValue = function (value) {
        var select = this.select;
        if (!select) {
            return;
        }
        var oldValue = select.value;
        var option = select.querySelector("option[value=\"" + value + "\"]");
        if (option) {
            option.selected = select.multiple ? !option.selected : true;
        }
        if (select.value !== oldValue) {
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };
    __decorate([
        property({
            param: {
                className: process.env.TYNY_PREFIX + "DropDown--flyout",
                defaultValue: "." + process.env.TYNY_PREFIX + "DropDown--flyout",
                tagName: 'div',
                type: 'element',
            },
        })
    ], DropDown.prototype, "flyout", void 0);
    __decorate([
        property({
            param: {
                className: process.env.TYNY_PREFIX + "DropDown--label",
                defaultValue: "." + process.env.TYNY_PREFIX + "DropDown--label",
                tagName: 'div',
                type: 'element',
            },
        })
    ], DropDown.prototype, "label", void 0);
    __decorate([
        property({
            param: { defaultValue: 'select', type: 'element' },
            watch: 'onElementChanged',
        })
    ], DropDown.prototype, "select", void 0);
    __decorate([
        event({ name: 'click', selector: '*[data-dropdown-value]' })
    ], DropDown.prototype, "onOptionClick", null);
    __decorate([
        update({ events: ['resize', 'scroll'], mode: 'read' })
    ], DropDown.prototype, "onUpdate", null);
    __decorate([
        event({ name: 'change', selector: 'select' })
    ], DropDown.prototype, "onValueChanged", null);
    return DropDown;
}(View));
export { DropDown };
