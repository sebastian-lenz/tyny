import { __decorate, __rest } from "tslib";
import { attr } from '../../utils/dom/attr';
import { event, property, update, View } from '../../core';
import { getWindowHeight } from '../../utils/dom/window';
import { template } from './template';
import { toArray } from '../../utils/lang/array/toArray';
export class DropDown extends View {
    constructor(_a = {}) {
        var { groupLabel = (el) => el.label, optionLabel = (el) => el.label, selectedLabel = (els) => els.length ? els.map((el) => el.label).join(', ') : '' } = _a, options = __rest(_a, ["groupLabel", "optionLabel", "selectedLabel"]);
        super(options);
        this.el.tabIndex = 0;
        this.groupLabel = groupLabel;
        this.optionLabel = optionLabel;
        this.selectedLabel = selectedLabel;
    }
    onConnected() {
        this.renderFlyout();
    }
    onElementChanged() {
        this.renderFlyout();
    }
    onOptionClick(event) {
        this.toggleValue(attr(event.current, 'data-dropdown-value') || '');
        this.el.blur();
    }
    onUpdate() {
        const { flyout } = this;
        const rect = this.el.getBoundingClientRect();
        const height = flyout.clientHeight;
        const viewHeight = getWindowHeight();
        return () => {
            flyout.classList.toggle('top', viewHeight - rect.bottom < height + 20);
        };
    }
    onValueChanged() {
        this.renderLabel();
    }
    renderFlyout() {
        const { component, groupLabel, optionLabel, select } = this;
        this.flyout.innerHTML = select
            ? template({
                className: component.className,
                element: select,
                groupLabel,
                optionLabel,
            })
            : '';
        this.renderLabel();
    }
    renderLabel() {
        const { label, select, selectedLabel } = this;
        if (!select) {
            label.innerHTML = '';
            label.removeAttribute('data-dropdown-selected');
            return;
        }
        const selected = toArray(select.selectedOptions);
        const values = selected.map((option) => option.value);
        label.innerHTML = selectedLabel(selected);
        label.setAttribute('data-dropdown-selected', values.join(','));
        this.findAll(`*[data-dropdown-value]`).forEach((element) => element.classList.toggle('selected', values.indexOf(attr(element, 'data-dropdown-value') || '') !== -1));
    }
    toggleValue(value) {
        const { select } = this;
        if (!select) {
            return;
        }
        const oldValue = select.value;
        const option = select.querySelector(`option[value="${value}"]`);
        if (option) {
            option.selected = select.multiple ? !option.selected : true;
        }
        if (select.value !== oldValue) {
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}
__decorate([
    property({
        param: {
            className: `${process.env.TYNY_PREFIX}DropDown--flyout`,
            defaultValue: `.${process.env.TYNY_PREFIX}DropDown--flyout`,
            tagName: 'div',
            type: 'element',
        },
    })
], DropDown.prototype, "flyout", void 0);
__decorate([
    property({
        param: {
            className: `${process.env.TYNY_PREFIX}DropDown--label`,
            defaultValue: `.${process.env.TYNY_PREFIX}DropDown--label`,
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
