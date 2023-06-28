import { __decorate } from "tslib";
import { update, View } from '../../core';
import { stop } from '../../fx/dispatcher';
import { WheelBehaviour } from './WheelBehaviour';
import { ZoomBehaviour } from './ZoomBehaviour';
const EPSILON = 0.0001;
export class ZoomPanel extends View {
    constructor(options) {
        super(options);
        this.coverPadding = 0;
        this.fitPadding = 0;
        this.height = 0;
        this.position = { x: 0, y: 0 };
        this.resizeMode = 'auto';
        this.scale = 1;
        this.width = 0;
        const { enabled = true } = options;
        this.zoomBehaviour = this.addBehaviour(ZoomBehaviour, { enabled });
        this.wheelBehaviour = this.addBehaviour(WheelBehaviour, { enabled });
    }
    applyViewProps([x, y, scale]) {
        this.scale = scale;
        this.position.x = x;
        this.position.y = y;
        stop(this);
        this.draw();
    }
    clampView() {
        const scale = this.limitScale(this.scale);
        const { x, y } = this.limitPosition(this.position, scale);
        this.applyViewProps([x, y, scale]);
    }
    coverView() {
        this.applyViewProps(this.getCoverViewProps());
    }
    isCoverView() {
        return this.matchesViewProps(this.getCoverViewProps());
    }
    isFitToView() {
        return this.matchesViewProps(this.getFitToViewProps());
    }
    fitToView() {
        this.applyViewProps(this.getFitToViewProps());
    }
    matchesViewProps([x, y, scale]) {
        return (Math.abs(this.scale - scale) < EPSILON &&
            Math.abs(this.position.x - x) < EPSILON &&
            Math.abs(this.position.y - y) < EPSILON);
    }
    getCenteredViewProps(scale) {
        const { height, width } = this;
        const displayWidth = this.getNativeWidth() * scale;
        const displayHeight = this.getNativeHeight() * scale;
        const x = (width - displayWidth) * 0.5;
        const y = (height - displayHeight) * 0.5;
        return [x, y, scale];
    }
    getCoverViewProps(padding = this.coverPadding) {
        return this.getCenteredViewProps(Math.max((this.height - padding * 2) / this.getNativeHeight(), (this.width - padding * 2) / this.getNativeWidth()));
    }
    getFitToViewProps(padding = this.fitPadding) {
        return this.getCenteredViewProps(Math.min(1, (this.height - padding * 2) / this.getNativeHeight(), (this.width - padding * 2) / this.getNativeWidth()));
    }
    getPositionBounds(scale = this.scale) {
        const { height, width } = this;
        const nativeHeight = this.getNativeHeight();
        const nativeWidth = this.getNativeWidth();
        const displayWidth = nativeWidth * scale;
        const displayHeight = nativeHeight * scale;
        const x = (width - displayWidth) * 0.5;
        const y = (height - displayHeight) * 0.5;
        return {
            xMax: Math.max(x, 0),
            xMin: Math.min(x, width - displayWidth),
            yMax: Math.max(y, 0),
            yMin: Math.min(y, height - displayHeight),
        };
    }
    getScaleBounds() {
        const { height, fitPadding: padding, width } = this;
        const nativeHeight = this.getNativeHeight();
        const nativeWidth = this.getNativeWidth();
        const scale = Math.min(1, (height - padding * 2) / nativeHeight, (width - padding * 2) / nativeWidth);
        return {
            min: scale,
            max: 1,
        };
    }
    limitPosition({ x, y }, scale = this.scale) {
        const { xMax, xMin, yMin, yMax } = this.getPositionBounds(scale);
        if (x < xMin)
            x = xMin;
        if (x > xMax)
            x = xMax;
        if (y < yMin)
            y = yMin;
        if (y > yMax)
            y = yMax;
        return { x, y };
    }
    limitScale(scale) {
        const { max, min } = this.getScaleBounds();
        if (scale < min)
            scale = min;
        if (scale > max)
            scale = max;
        return scale;
    }
    setPosition({ x, y }) {
        const { position } = this;
        if (position.x === x && position.y === y)
            return;
        position.x = x;
        position.y = y;
        this.draw();
    }
    setScale(value) {
        if (this.scale === value)
            return;
        this.scale = value;
        this.draw();
    }
    onMeasure() {
        const { el, resizeMode } = this;
        const wasFit = resizeMode == 'auto' && this.isFitToView();
        this.height = el.offsetHeight;
        this.width = el.offsetWidth;
        switch (resizeMode) {
            case 'cover':
                return this.coverView;
            case 'fit':
                return this.fitToView;
            case 'clamp':
                return this.clampView;
            case 'auto':
                return wasFit ? this.fitToView : undefined;
        }
    }
}
__decorate([
    update({ events: 'resize', mode: 'read' })
], ZoomPanel.prototype, "onMeasure", null);
