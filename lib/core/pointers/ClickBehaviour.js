import { Behaviour } from '../Behaviour';
import { on } from '../../utils/dom/event';
export class ClickBehaviour extends Behaviour {
    constructor(view, options) {
        super(view, options);
        this.shouldPreventNextClick = false;
        this.onClick = options.onClick || null;
        const listeners = (this.listeners = [
            on(view.el, 'click', this.onViewClick, { capture: true, scope: this }),
        ]);
    }
    onDestroyed() {
        super.onDestroyed();
        if (this.listeners) {
            this.listeners.forEach((off) => off());
            this.listeners = null;
        }
    }
    onViewClick(event) {
        if (this.shouldPreventNextClick) {
            this.shouldPreventNextClick = false;
            event.preventDefault();
            event.stopPropagation();
        }
        else if (this.onClick) {
            this.onClick(event);
        }
    }
    preventNextClick() {
        this.shouldPreventNextClick = true;
        setTimeout(() => {
            this.shouldPreventNextClick = false;
        }, 200);
    }
    static getClickBehaviour(view) {
        for (const behaviour of view.behaviours) {
            if (behaviour instanceof ClickBehaviour) {
                return behaviour;
            }
        }
        return null;
    }
    static tryPreventNextClick(view) {
        var _a;
        (_a = this.getClickBehaviour(view)) === null || _a === void 0 ? void 0 : _a.preventNextClick();
    }
}
