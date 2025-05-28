import { __decorate } from "tslib";
import { event, property, View } from '../../index';
import { transistHeight } from '../../fx/transistHeight';
export class AriaComboBox extends View {
    constructor(options) {
        super(options);
        this.activeOption = null;
        this.isExpanded = false;
        this.selectedOption = null;
    }
    get activeIndex() {
        const { options, activeOption } = this;
        return options.findIndex((option) => option === activeOption);
    }
    set activeIndex(value) {
        const { options } = this;
        if (!options.length || value === -1) {
            this.setActiveOption(null);
        }
        else if (value < 0 || value > options.length) {
            this.setActiveOption(options[options.length - 1]);
        }
        else {
            this.setActiveOption(options[value]);
        }
    }
    get comboBox() {
        return this.find('*[role="combobox"]') || this.el;
    }
    get mask() {
        return this.params.element({
            defaultValue: '*[data-combobox-mask]',
            name: 'mask',
        });
    }
    get options() {
        return this.findAll('*[role="option"]');
    }
    get selectedIndex() {
        const { options, selectedOption } = this;
        return options.findIndex((option) => option === selectedOption);
    }
    set selectedIndex(value) {
        const { options } = this;
        if (value < 0 || value > options.length) {
            this.setSelectedOption(null);
        }
        else {
            this.setSelectedOption(options[value]);
        }
    }
    handleChange(option) {
        this.setSelectedOption(option);
        this.setExpanded(false);
    }
    onFocusOut(event) {
        let target = event.relatedTarget;
        while (target) {
            if (target === this.el)
                return;
            target = target.parentElement;
        }
        this.setExpanded(false);
    }
    onComboBoxClick() {
        this.setExpanded(!this.isExpanded);
    }
    onKeyDown(event) {
        if (this.isExpanded
            ? this.processKeyExpanded(event.key)
            : this.processKeyClosed(event.key)) {
            event.preventDefault();
        }
    }
    onOptionClick(event) {
        this.handleChange(event.current);
        event.preventDefault();
    }
    onOptionMouseOver(event) {
        this.setActiveOption(event.current);
    }
    processKeyClosed(key) {
        switch (key) {
            case 'Home':
                this.setExpanded(true, 0);
                return true;
            case 'End':
                this.setExpanded(true, -2);
                return true;
            case ' ':
            case 'Enter':
            case 'ArrowUp':
            case 'ArrowDown':
                this.setExpanded(true);
                return true;
            default:
                return false;
        }
    }
    processKeyExpanded(key) {
        const { activeIndex, activeOption, options } = this;
        switch (key) {
            case 'ArrowUp':
                this.activeIndex = Math.max(0, activeIndex - 1);
                return true;
            case 'ArrowDown':
                this.activeIndex = Math.min(options.length - 1, activeIndex + 1);
                return true;
            case 'Home':
                this.activeIndex = 0;
                return true;
            case 'End':
                this.activeIndex = -2;
                return true;
            case ' ':
            case 'Enter':
                this.handleChange(activeOption);
                return true;
            case 'Escape':
                this.setExpanded(false);
                return true;
            default:
                return false;
        }
    }
    setExpanded(value, initialActiveIndex = Math.max(0, this.selectedIndex)) {
        if (this.isExpanded === value)
            return;
        this.isExpanded = value;
        const { mask } = this;
        const apply = () => {
            this.toggleClass('expanded', value);
            this.comboBox.setAttribute('aria-expanded', value ? 'true' : 'false');
            this.activeIndex = value ? initialActiveIndex : -1;
        };
        if (mask) {
            transistHeight(mask, apply, this.params.options.transition);
        }
        else {
            apply();
        }
    }
    setActiveOption(value) {
        const { activeOption } = this;
        if (activeOption === value)
            return;
        this.activeOption = value;
        this.comboBox.setAttribute('aria-activedescendant', value ? value.id : '');
        if (activeOption) {
            activeOption.classList.remove('active');
        }
        if (value) {
            value.classList.add('active');
        }
    }
    setSelectedOption(value) {
        const { selectedOption } = this;
        if (selectedOption === value)
            return;
        this.selectedOption = value;
        if (selectedOption) {
            selectedOption.setAttribute('aria-selected', 'false');
        }
        if (value) {
            value.setAttribute('aria-selected', 'true');
        }
    }
}
__decorate([
    property({ immediate: true })
], AriaComboBox.prototype, "mask", null);
__decorate([
    property()
], AriaComboBox.prototype, "options", null);
__decorate([
    event({ name: 'focusout' })
], AriaComboBox.prototype, "onFocusOut", null);
__decorate([
    event({ name: 'click', selector: '*[role="combobox"]' })
], AriaComboBox.prototype, "onComboBoxClick", null);
__decorate([
    event({ name: 'keydown' })
], AriaComboBox.prototype, "onKeyDown", null);
__decorate([
    event({ name: 'click', selector: '*[role="option"]' })
], AriaComboBox.prototype, "onOptionClick", null);
__decorate([
    event({ name: 'mouseover', selector: '*[role="option"]' })
], AriaComboBox.prototype, "onOptionMouseOver", null);
