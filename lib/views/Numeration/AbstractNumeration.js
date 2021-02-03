import { __decorate } from "tslib";
import { event, View } from '../../core';
export const numerationChangeEvent = 'tyny:numerationChange';
export class AbstractNumeration extends View {
    constructor(options = {}) {
        super(Object.assign({ tagName: 'ul' }, options));
        this.items = [];
        this.selectedRange = { min: -1, max: -1 };
        const { itemClass = `${this.component.className}--item`, itemTagName = 'li', selectedItemClass = 'selected', } = options;
        this.itemClass = itemClass;
        this.itemTagName = itemTagName;
        this.selectedItemClass = selectedItemClass;
        this.container = this.params.element({
            name: 'container',
            defaultValue: this.el,
        });
    }
    setLength(length) {
        const { container, itemClass, items, itemTagName } = this;
        let itemsLength = items.length;
        if (itemsLength == length) {
            return this;
        }
        while (itemsLength < length) {
            let item = document.createElement(itemTagName);
            item.className = itemClass;
            item.innerText = `${itemsLength + 1}`;
            items.push(item);
            itemsLength += 1;
            container.appendChild(item);
        }
        while (itemsLength > length) {
            let child = items.pop();
            if (child) {
                container.removeChild(child);
            }
            itemsLength -= 1;
        }
        this.setSelected(this.selectedRange);
    }
    setSelected(range) {
        const { items, selectedRange, selectedItemClass } = this;
        const length = items.length - 1;
        let { min, max } = range;
        min = Math.max(-1, Math.min(length, Math.floor(min)));
        max = Math.max(-1, Math.min(length, Math.ceil(max)));
        if (max < min) {
            let tmp = min;
            min = max;
            max = tmp;
        }
        if (selectedRange.min == min && selectedRange.max == max) {
            return this;
        }
        for (let index = 0; index <= length; index++) {
            items[index].classList.toggle(selectedItemClass, index >= min && index <= max);
        }
        selectedRange.min = min;
        selectedRange.max = max;
        return this;
    }
    setSelectedIndex(index) {
        this.setSelected({ min: index, max: index });
    }
    onClick(event) {
        const { el, items } = this;
        let target = event.target;
        while (target) {
            const index = items.indexOf(target);
            if (index !== -1) {
                return this.selectIndex(index);
            }
            if (target === el)
                return;
            target = target.parentElement;
        }
    }
}
__decorate([
    event({ name: 'click' })
], AbstractNumeration.prototype, "onClick", null);
