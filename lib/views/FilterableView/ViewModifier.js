import { __decorate } from "tslib";
import { FilterableView } from './index';
import { getParentView, property, View } from '../../core';
export class ViewModifier extends View {
    constructor(options = {}) {
        super(options);
    }
    get target() {
        return getParentView(this.el, FilterableView);
    }
    softReset() { }
}
__decorate([
    property()
], ViewModifier.prototype, "target", null);
