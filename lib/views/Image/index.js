import { __decorate } from "tslib";
import { property, update, View } from '../../core';
import { once } from '../../utils/dom/event/once';
import { SourceSet } from './SourceSet';
import { visibility } from '../../services/visibility';
import { attr } from '../../utils/dom/attr';
import { toInt } from '../../utils/lang/number/toInt';
export class Image extends View {
    constructor(options = {}) {
        super(options);
        this.currentSource = '';
        this.displayHeight = 0;
        this.displayWidth = 0;
        this.isLoaded = false;
        this.isVisible = false;
        this.naturalHeight = 0;
        this.naturalWidth = 0;
        this.naturalHeight = toInt(attr(this.el, 'height'));
        this.naturalWidth = toInt(attr(this.el, 'width'));
    }
    get promise() {
        return new Promise((resolve) => {
            const { el } = this;
            el.complete ? resolve() : once(el, 'load', () => resolve());
        }).then(() => {
            const { el } = this;
            el.classList.add('loaded');
            this.isLoaded = true;
            if (el.naturalHeight !== 0 && el.naturalWidth !== 0) {
                this.naturalHeight = el.naturalHeight;
                this.naturalWidth = el.naturalWidth;
            }
        });
    }
    load() {
        this.isVisible = true;
        this.update();
        return this.promise;
    }
    setSource(value) {
        if (this.currentSource === value)
            return;
        this.currentSource = value;
        this.promise;
        this.el.src = value;
    }
    setVisible(value) {
        this.isVisible = value;
        if (value)
            this.update();
    }
    update() {
        const { displayWidth, isVisible, sourceSet } = this;
        if (isVisible) {
            sourceSet.get(displayWidth).then((source) => this.setSource(source));
        }
    }
    onConnected() {
        super.onConnected();
        visibility.observe(this);
    }
    onDisconnected() {
        super.onDisconnected();
        visibility.unobserve(this);
    }
    onResize() {
        const { displayHeight, displayWidth, el } = this;
        const height = (this.displayHeight = el.clientHeight);
        const width = (this.displayWidth = el.clientWidth);
        if (displayHeight !== height || displayWidth !== width) {
            return this.update;
        }
    }
}
__decorate([
    property({ immutable: true })
], Image.prototype, "promise", null);
__decorate([
    property({
        immutable: true,
        param: { ctor: SourceSet, type: 'instance', attribute: 'data-srcset' },
    })
], Image.prototype, "sourceSet", void 0);
__decorate([
    update({ events: ['resize', 'update'], mode: 'read' })
], Image.prototype, "onResize", null);
