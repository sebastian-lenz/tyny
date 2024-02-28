import { __decorate } from "tslib";
import { event, property } from '../../../core';
import { debounce } from '../../../utils/lang/function';
import { ViewModifier } from '../ViewModifier';
export class InputModifier extends ViewModifier {
    constructor(options = {}) {
        super(options);
        this.onChangeDebounced = null;
        this.value = '';
    }
    get paramName() {
        return this.el.name;
    }
    getValue() {
        return this.el.value;
    }
    getParams() {
        return {
            [this.paramName]: this.getValue(),
        };
    }
    setValue(value, silent) {
        this.el.value = value;
        if (!silent) {
            this.onChange();
        }
    }
    sync({ url }) {
        const value = url.getParam(this.paramName, '');
        if (this.getValue() === value) {
            return false;
        }
        this.setValue(typeof value === 'string' ? value : `${value}`, true);
        return true;
    }
    onChange() {
        let { onChangeDebounced } = this;
        if (!onChangeDebounced) {
            onChangeDebounced = this.onChangeDebounced = debounce(() => {
                const { triggerSoftReset, target } = this;
                if (target) {
                    if (triggerSoftReset) {
                        target.softReset();
                    }
                    target.commit();
                }
            }, this.changeDelay);
        }
        onChangeDebounced();
    }
}
__decorate([
    property({ param: { type: 'number', defaultValue: 500 } })
], InputModifier.prototype, "changeDelay", void 0);
__decorate([
    property({ param: { type: 'string', defaultValue: '' } })
], InputModifier.prototype, "defaultValue", void 0);
__decorate([
    property({ param: { defaultValue: false, type: 'bool' } })
], InputModifier.prototype, "triggerSoftReset", void 0);
__decorate([
    property({ param: { type: 'string' } })
], InputModifier.prototype, "paramName", null);
__decorate([
    event({ name: 'input change' })
], InputModifier.prototype, "onChange", null);
