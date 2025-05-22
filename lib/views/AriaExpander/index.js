import { __decorate } from "tslib";
import { boolify } from '../../utils/lang/string';
import { data } from '../../utils/dom/attr';
import { event, View } from '../../core';
import { toBoolean } from '../../utils/lang/misc';
import { transistHeight } from '../../fx/transistHeight';
export class AriaExpander extends View {
    constructor(options) {
        super(options);
        const button = this.find('*[aria-controls]');
        const targetId = data(button, 'aria-controls');
        this.button = button;
        this.target = targetId ? document.getElementById(targetId) : null;
        this.isExpanded = toBoolean(data(button, 'aria-expanded'));
        this.mask = this.params.element({
            name: 'mask',
            defaultValue: this.target || undefined,
        });
    }
    onButtonClick(event) {
        this.setExpanded();
    }
    setExpanded(value = !this.isExpanded) {
        if (this.isExpanded === value)
            return;
        this.isExpanded = value;
        const { button, mask, target } = this;
        if (button) {
            button.setAttribute('aria-expanded', boolify(value));
        }
        if (target) {
            target.setAttribute('aria-hidden', boolify(!value));
        }
        if (mask) {
            transistHeight(mask, () => {
                mask.classList.add('animated');
                mask.classList.toggle('expanded', value);
            }).then(() => mask.classList.remove('animated'));
        }
    }
}
__decorate([
    event({ name: 'click', selector: '*[aria-controls]' })
], AriaExpander.prototype, "onButtonClick", null);
