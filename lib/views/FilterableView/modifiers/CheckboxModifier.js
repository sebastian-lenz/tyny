import { __decorate } from "tslib";
import { event, property } from '../../../core';
import { ViewModifier } from '../ViewModifier';
export class CheckboxModifier extends ViewModifier {
    get paramName() {
        return this.el.name;
    }
    constructor(options = {}) {
        super(options);
        this.value = '';
    }
    getValue() {
        return this.el.checked;
    }
    getParams() {
        const paramValue = this.getParamValue();
        if (!this.getValue() || !paramValue) {
            return {};
        }
        return {
            [this.paramName]: paramValue,
        };
    }
    getParamValue() {
        return this.el.value;
    }
    setValue(value, silent) {
        this.el.checked = value;
        if (!silent) {
            this.onChange();
        }
    }
    sync({ url }) {
        const value = url.getParam(this.paramName, '') === this.getParamValue();
        if (this.getValue() === value) {
            return false;
        }
        this.setValue(value, true);
        return true;
    }
    onChange() {
        const { triggerSoftReset, target } = this;
        if (target) {
            if (triggerSoftReset) {
                target.softReset();
            }
            target.commit();
        }
    }
}
__decorate([
    property({ param: { type: 'bool', defaultValue: false } })
], CheckboxModifier.prototype, "defaultValue", void 0);
__decorate([
    property({ param: { defaultValue: false, type: 'bool' } })
], CheckboxModifier.prototype, "triggerSoftReset", void 0);
__decorate([
    property({ param: { type: 'string' } })
], CheckboxModifier.prototype, "paramName", null);
__decorate([
    event({ name: 'change' })
], CheckboxModifier.prototype, "onChange", null);
