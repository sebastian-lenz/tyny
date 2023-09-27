import { __decorate } from "tslib";
import { attr } from '../../../utils/dom/attr';
import { event } from '../../../core/decorators/event';
import { toInt } from '../../../utils/lang/number/toInt';
import { Url } from '../../../utils/types/Url';
import { BehaviourModifier, } from '../BehaviourModifier';
export class PageModifier extends BehaviourModifier {
    constructor(view, options = {}) {
        super(view, options);
        this.value = 1;
        const { paramName = 'page' } = options;
        this.paramName = paramName;
    }
    getParams() {
        const { paramName, value } = this;
        return {
            [paramName]: value > 1 ? `${value}` : null,
        };
    }
    getUrl(page) {
        const { paramName, view } = this;
        return view.getUrl({
            [paramName]: page > 1 ? `${page}` : null,
        });
    }
    setPage(value) {
        if (this.value !== value) {
            this.value = value;
            this.view.commit();
        }
    }
    softReset() {
        this.setPage(1);
    }
    sync({ url }) {
        const page = url.getParam(this.paramName, '1');
        const value = parseInt(page);
        if (this.value === value) {
            return false;
        }
        this.value = value;
        return true;
    }
    onPageClick(event) {
        const href = attr(event.current, 'href') || '';
        const page = toInt(Url.create(href).getParam(this.paramName, '1'));
        this.setPage(page);
        event.preventDefault();
    }
}
__decorate([
    event({ name: 'click', selector: '*[data-filter-page]' })
], PageModifier.prototype, "onPageClick", null);
