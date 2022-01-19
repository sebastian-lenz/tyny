import { __decorate } from "tslib";
import { event, property } from '../../../core';
import { Url } from '../../../utils/types/Url';
import { ViewModifier } from '../ViewModifier';
const selector = 'input[type=checkbox],input[type=radio]';
export class CheckboxesModifier extends ViewModifier {
    constructor(options = {}) {
        super(options);
    }
    getCheckboxes() {
        return this.findAll(this.checkboxSelector);
    }
    getParams() {
        const paramValue = this.getValues().map(encodeURIComponent).join(this.glue);
        return {
            [this.paramName]: Url.safeParam(paramValue),
        };
    }
    getValues() {
        return this.getCheckboxes()
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value)
            .sort();
    }
    setValues(values, silent) {
        for (const checkbox of this.getCheckboxes()) {
            if (!checkbox.value) {
                checkbox.checked = !values.length;
            }
            else {
                checkbox.checked = values.indexOf(checkbox.value) !== -1;
            }
        }
        if (!silent) {
            this.onChange();
        }
    }
    sync({ url }) {
        const current = this.getValues();
        const values = url
            .getParam(this.paramName, '')
            .split(this.glue)
            .filter((value) => !!value)
            .sort();
        if (current.length === values.length &&
            current.every((value) => values.indexOf(value) !== -1)) {
            return false;
        }
        this.setValues(values, true);
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
    property({ param: { defaultValue: selector, type: 'string' } })
], CheckboxesModifier.prototype, "checkboxSelector", void 0);
__decorate([
    property({ param: { defaultValue: ',', type: 'string' } })
], CheckboxesModifier.prototype, "glue", void 0);
__decorate([
    property({ param: { defaultValue: 'unknown', type: 'string' } })
], CheckboxesModifier.prototype, "paramName", void 0);
__decorate([
    property({ param: { defaultValue: false, type: 'bool' } })
], CheckboxesModifier.prototype, "triggerSoftReset", void 0);
__decorate([
    event({ name: 'change' })
], CheckboxesModifier.prototype, "onChange", null);
