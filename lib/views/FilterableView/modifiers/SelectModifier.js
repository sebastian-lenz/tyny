import { __decorate } from "tslib";
import { event, property } from '../../../core';
import { ViewModifier } from '../ViewModifier';
export class SelectModifier extends ViewModifier {
    constructor(options = {}) {
        super(options);
        this.value = '';
    }
    get paramName() {
        return this.el.name;
    }
    getValue() {
        const { selectedOptions } = this.el;
        const result = [];
        for (let index = 0; index < selectedOptions.length; index++) {
            const option = selectedOptions[index];
            if (option.value) {
                result.push(option.value);
            }
        }
        return result.length ? result.sort().join(',') : null;
    }
    getParams() {
        return {
            [this.paramName]: this.getValue(),
        };
    }
    setValue(value, silent) {
        const values = value ? value.split(',').sort() : [];
        if (values.join(',') === this.getValue()) {
            return;
        }
        const { options } = this.el;
        for (let index = 0; index < options.length; index++) {
            const option = options[index];
            option.selected = values.indexOf(option.value) !== -1;
        }
        if (!silent) {
            this.onChange();
        }
    }
    sync({ url }) {
        const value = url.getParam(this.paramName);
        if (this.getValue() === value) {
            return false;
        }
        this.setValue(value, true);
        return true;
    }
    onChange() {
        const { triggerSoftReset, target } = this;
        if (target) {
            if (triggerSoftReset)
                target.softReset();
            target.commit();
        }
    }
}
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
