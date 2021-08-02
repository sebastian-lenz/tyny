import { inBrowser } from '../utils/env/browser';
import { isInViewport } from '../utils/dom/window/isInViewport';
import { on } from '../utils/dom/event/on';
import { toFloat } from '../utils/lang/number/toFloat';
export class IntersectionObserverClass {
    constructor(callback, { rootMargin = '0 0' } = {}) {
        let pending = false;
        const [offsetTop, offsetLeft] = (rootMargin || '0 0')
            .split(' ')
            .map(toFloat);
        this.root = null;
        this.rootMargin = rootMargin;
        this.thresholds = [];
        this.targets = [];
        this.offsetTop = offsetTop;
        this.offsetLeft = offsetLeft;
        this.apply = () => {
            if (pending) {
                return;
            }
            pending = requestAnimationFrame(() => setTimeout(() => {
                const records = this.takeRecords();
                if (records.length) {
                    callback(records, this);
                }
                pending = false;
            }));
        };
        if (inBrowser) {
            this.off = on(window, 'scroll resize load', this.apply, {
                passive: true,
                capture: true,
            });
        }
    }
    disconnect() {
        this.targets = [];
        if (this.off) {
            this.off();
        }
    }
    observe(target) {
        this.targets.push({
            target,
            isIntersecting: null,
        });
        this.apply();
    }
    takeRecords() {
        return this.targets.filter((entry) => {
            const inView = isInViewport(entry.target, this.offsetTop, this.offsetLeft);
            if (inView !== entry.isIntersecting) {
                entry.isIntersecting = inView;
                return true;
            }
        });
    }
    unobserve(element) {
        this.targets = this.targets.filter((target) => target.target !== element);
    }
}
export const IntersectionObserver = (inBrowser && window.IntersectionObserver) || IntersectionObserverClass;
export class VisibilityObserver {
    constructor() {
        this.targets = [];
        const callback = (entries) => {
            const { targets } = this;
            entries.forEach((entry) => {
                targets
                    .filter((target) => target.el === entry.target)
                    .forEach((target) => target.setVisible(entry.isIntersecting));
            });
        };
        this.observer = new IntersectionObserver(callback, {
            rootMargin: '500px 0px',
        });
    }
    hasTargets(el) {
        return this.targets.some((target) => target.el === el);
    }
    observe(target) {
        const isObserved = this.hasTargets(target.el);
        this.targets.push(target);
        if (!isObserved) {
            this.observer.observe(target.el);
        }
    }
    unobserve(target) {
        this.targets = this.targets.filter((value) => value !== target);
        if (!this.hasTargets(target.el)) {
            this.observer.unobserve(target.el);
        }
    }
}
export const visibility = new VisibilityObserver();
