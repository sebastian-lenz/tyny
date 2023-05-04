import { __decorate } from "tslib";
import { update, View } from '../../core';
import { stop } from '../../fx/dispatcher';
import { WheelBehaviour } from './WheelBehaviour';
import { ZoomBehaviour } from './ZoomBehaviour';
const EPSILON = 0.0001;
export class ZoomPanel extends View {
    constructor(options) {
        super(options);
        this.fitPadding = 0;
        this.height = 0;
        this.position = { x: 0, y: 0 };
        this.resizeMode = 'auto';
        this.scale = 1;
        this.width = 0;
        this.zoomBehaviour = this.addBehaviour(ZoomBehaviour);
        this.wheelBehaviour = this.addBehaviour(WheelBehaviour);
    }
    clampView() {
        const scale = this.limitScale(this.scale);
        const { x, y } = this.limitPosition(this.position, scale);
        stop(this);
        this.scale = scale;
        this.position.x = x;
        this.position.y = y;
        this.draw();
    }
    isFitToView() {
        const [x, y, scale] = this.getFitToViewProps();
        return (Math.abs(this.scale - scale) < EPSILON &&
            Math.abs(this.position.x - x) < EPSILON &&
            Math.abs(this.position.y - y) < EPSILON);
    }
    fitToView() {
        stop(this);
        const [x, y, scale] = this.getFitToViewProps();
        this.scale = scale;
        this.position.x = x;
        this.position.y = y;
        this.draw();
    }
    getFitToViewProps() {
        const { height, fitPadding, width } = this;
        const nativeHeight = this.getNativeHeight();
        const nativeWidth = this.getNativeWidth();
        const scale = Math.min(1, (height - fitPadding * 2) / nativeHeight, (width - fitPadding * 2) / nativeWidth);
        const displayWidth = nativeWidth * scale;
        const displayHeight = nativeHeight * scale;
        const x = (width - displayWidth) * 0.5;
        const y = (height - displayHeight) * 0.5;
        return [x, y, scale];
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
