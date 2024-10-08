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
        if (this.resizeMode === 'auto' && this.width == 0 && this.height == 0) {
            return true;
        }
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
    getCenteredViewProps(scale, [focusX, focusY] = [0.5, 0.5], [offsetX, offsetY] = [0, 0]) {
        const { height, width } = this;
        const displayWidth = this.getNativeWidth() * scale;
        const displayHeight = this.getNativeHeight() * scale;
        const x = offsetX + (width - displayWidth) * focusX;
        const y = offsetY + (height - displayHeight) * focusY;
        return [x, y, scale];
    }
    getCoverViewProps(padding = this.coverPadding) {
        return this.getCenteredViewProps(Math.max((this.height - padding * 2) / this.getNativeHeight(), (this.width - padding * 2) / this.getNativeWidth()));
    }
    getFitToViewProps(padding = this.fitPadding) {
        const [width, height, offset] = this.getViewportProps(padding);
        return this.getCenteredViewProps(Math.min(1, height / this.getNativeHeight(), width / this.getNativeWidth()), [0.5, 0.5], offset);
    }
    getPositionBounds(scale = this.scale) {
        const [viewWidth, viewHeight] = this.getViewportProps();
        const { fitPadding, height, width } = this;
        const nativeHeight = this.getNativeHeight();
        const nativeWidth = this.getNativeWidth();
        const displayWidth = nativeWidth * scale;
        const displayHeight = nativeHeight * scale;
        const x = (viewWidth - displayWidth) * 0.5;
        const y = (viewHeight - displayHeight) * 0.5;
        let shiftX = 0;
        if (displayWidth < width) {
            shiftX = typeof fitPadding === 'number' ? fitPadding : fitPadding[3];
        }
        let shiftY = 0;
        if (displayHeight < height) {
            shiftY = typeof fitPadding === 'number' ? fitPadding : fitPadding[0];
        }
        const result = {
            xMax: Math.max(x + shiftX, shiftX),
            xMin: Math.min(x + shiftX, width - displayWidth + shiftX),
            yMax: Math.max(y + shiftY, shiftY),
            yMin: Math.min(y + shiftY, height - displayHeight + shiftY),
        };
        return result;
    }
    getScaleBounds() {
        const [width, height] = this.getViewportProps();
        const nativeHeight = this.getNativeHeight();
        const nativeWidth = this.getNativeWidth();
        const scale = Math.min(1, height / nativeHeight, width / nativeWidth);
        return {
            min: scale,
            max: 1,
        };
    }
    getViewportProps(padding = this.fitPadding) {
        let { height, width } = this;
        if (typeof padding === 'number') {
            return [width - 2 * padding, height - 2 * padding, [0, 0]];
        }
        else {
            const paddingHeight = padding[0] + padding[2];
            const paddingWidth = padding[1] + padding[3];
            return [
                width - paddingWidth,
                height - paddingHeight,
                [padding[3] - paddingWidth * 0.5, padding[0] - paddingHeight * 0.5],
            ];
        }
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
                return wasFit ? this.fitToView : this.clampView;
        }
    }
}
__decorate([
    update({ events: 'resize', mode: 'read' })
], ZoomPanel.prototype, "onMeasure", null);
