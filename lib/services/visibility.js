import { inBrowser } from '../utils/env/browser';
import { isInViewport } from '../utils/dom/window/isInViewport';
import { on } from '../utils/dom/event/on';
import { toFloat } from '../utils/lang/number/toFloat';
var IntersectionObserverClass = /** @class */ (function () {
    function IntersectionObserverClass(callback, _a) {
        var _this = this;
        var _b = (_a === void 0 ? {} : _a).rootMargin, rootMargin = _b === void 0 ? '0 0' : _b;
        var pending = false;
        var _c = (rootMargin || '0 0')
            .split(' ')
            .map(toFloat), offsetTop = _c[0], offsetLeft = _c[1];
        this.root = null;
        this.rootMargin = rootMargin;
        this.thresholds = [];
        this.targets = [];
        this.offsetTop = offsetTop;
        this.offsetLeft = offsetLeft;
        this.apply = function () {
            if (pending) {
                return;
            }
            pending = requestAnimationFrame(function () {
                return setTimeout(function () {
                    var records = _this.takeRecords();
                    if (records.length) {
                        callback(records, _this);
                    }
                    pending = false;
                });
            });
        };
        this.off = on(window, 'scroll resize load', this.apply, {
            passive: true,
            capture: true,
        });
    }
    IntersectionObserverClass.prototype.disconnect = function () {
        this.targets = [];
        this.off();
    };
    IntersectionObserverClass.prototype.observe = function (target) {
        this.targets.push({
            target: target,
            isIntersecting: null,
        });
        this.apply();
    };
    IntersectionObserverClass.prototype.takeRecords = function () {
        var _this = this;
        return this.targets.filter(function (entry) {
            var inView = isInViewport(entry.target, _this.offsetTop, _this.offsetLeft);
            if (inView !== entry.isIntersecting) {
                entry.isIntersecting = inView;
                return true;
            }
        });
    };
    IntersectionObserverClass.prototype.unobserve = function (element) {
        this.targets = this.targets.filter(function (target) { return target.target !== element; });
    };
    return IntersectionObserverClass;
}());
export { IntersectionObserverClass };
export var IntersectionObserver = (inBrowser && window.IntersectionObserver) || IntersectionObserverClass;
var VisibilityObserver = /** @class */ (function () {
    function VisibilityObserver() {
        var _this = this;
        this.targets = [];
        var callback = function (entries) {
            var targets = _this.targets;
            entries.forEach(function (entry) {
                targets
                    .filter(function (target) { return target.el === entry.target; })
                    .forEach(function (target) { return target.setVisible(entry.isIntersecting); });
            });
        };
        this.observer = new IntersectionObserver(callback, {
            rootMargin: '500px 0px',
        });
    }
    VisibilityObserver.prototype.hasTargets = function (el) {
        return this.targets.some(function (target) { return target.el === el; });
    };
    VisibilityObserver.prototype.observe = function (target) {
        var isObserved = this.hasTargets(target.el);
        this.targets.push(target);
        if (!isObserved) {
            this.observer.observe(target.el);
        }
    };
    VisibilityObserver.prototype.unobserve = function (target) {
        this.targets = this.targets.filter(function (value) { return value !== target; });
        if (!this.hasTargets(target.el)) {
            this.observer.unobserve(target.el);
        }
    };
    return VisibilityObserver;
}());
export { VisibilityObserver };
export var visibility = new VisibilityObserver();
