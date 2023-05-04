import { AbstractAdapter } from './AbstractAdapter';
import { MouseAdapter } from './MouseAdapter';
export let isIOSFix = false;
const id = (touch) => `touch-${touch.identifier}`;
const each = (touches, callback) => {
    for (let index = 0; index < touches.length; index += 1) {
        callback(touches[index]);
    }
};
export class TouchAdapter extends AbstractAdapter {
    constructor(element, pointerList) {
        super(element, pointerList);
        this.usePassiveEvents = false;
        this.mouseAdapter = new MouseAdapter(element, pointerList);
    }
    getEvents() {
        return {
            touchstart: this.handleTouchStart,
        };
    }
    getTrackingEvents() {
        return {
            touchmove: this.handleTouchMove,
            touchend: this.handleTouchEnd,
            touchcancel: this.handleTouchEnd,
        };
    }
    handleTouchStart(event) {
        each(event.changedTouches, (touch) => {
            this.pointerList.addPointer(event, {
                adapter: this,
                clientX: touch.clientX,
                clientY: touch.clientY,
                id: id(touch),
                type: 'touch',
            });
        });
    }
    handleTouchMove(event) {
        each(event.changedTouches, (touch) => {
            this.pointerList.movePointer(event, id(touch), {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
        });
    }
    handleTouchEnd(event) {
        this.mouseAdapter.mute();
        each(event.changedTouches, (touch) => {
            this.pointerList.removePointer(event, id(touch));
        });
    }
    static isSupported() {
        if (isIOSFix) {
            return true;
        }
        let isSupported = 'ontouchstart' in window;
        if (isSupported) {
            isIOSFix = true;
            window.addEventListener('touchmove', function () { }, { passive: false });
        }
        return isSupported;
    }
}