import { __decorate } from "tslib";
import { attr } from '../../utils/dom/attr';
import { once } from '../../utils/dom/event/once';
import { property, update, View } from '../../core';
import { SourceSet } from './SourceSet';
import { toInt } from '../../utils/lang/number/toInt';
import { visibility } from '../../services/visibility';
export class Image extends View {
    constructor(options = {}) {
        super(options);
        this.currentSource = '';
        this.displayHeight = 0;
        this.displayWidth = 0;
        this.isLoaded = false;
        this.isVisible = false;
        this.loadMode = 2;
        this.naturalHeight = 0;
        this.naturalWidth = 0;
        this.naturalHeight = toInt(attr(this.el, 'height'));
        this.naturalWidth = toInt(attr(this.el, 'width'));
    }
    get promise() {
        return new Promise((resolve) => {
            const { el } = this;
            const hasSrc = el.hasAttribute('src') || el.hasAttribute('srcset');
            if (hasSrc && el.complete) {
                resolve();
            }
            else {
                once(el, 'load', resolve);
            }
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
        this.loadMode = 0;
        this.update();
        return this.promise;
    }
    setLoadMode(value) {
        if (this.loadMode === value)
            return;
        this.loadMode = value;
        if (value === 2) {
            this.update();
        }
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
        const { displayWidth, sourceSet } = this;
        if (this.allowLoad()) {
            sourceSet.get(displayWidth).then((source) => this.setSource(source));
        }
    }
    allowLoad() {
        if (this.loadMode === 2) {
            return this.isVisible;
        }
        return this.loadMode === 0;
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