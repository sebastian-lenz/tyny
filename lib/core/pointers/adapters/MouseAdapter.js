import { AbstractAdapter } from './AbstractAdapter';
export class MouseAdapter extends AbstractAdapter {
    getEvents() {
        return {
            mousedown: this.handleMouseDown,
        };
    }
    getTrackingEvents() {
        return {
            mousemove: this.handleMouseMove,
            mouseup: this.handleMouseUp,
        };
    }
    mute() {
        if (this.muteTimeout)
            clearTimeout(this.muteTimeout);
        this.muteTimeout = window.setTimeout(() => (this.muteTimeout = undefined), 500);
    }
    handleMouseDown(event) {
        if (this.muteTimeout)
            return;
        this.pointerList.addPointer(event, {
            adapter: this,
            clientX: event.clientX,
            clientY: event.clientY,
            id: 'mouse',
            type: 'mouse',
        });
    }
    handleMouseMove(event) {
        this.pointerList.movePointer(event, 'mouse', {
            clientX: event.clientX,
            clientY: event.clientY,
        });
    }
    handleMouseUp(event) {
        this.pointerList.removePointer(event, 'mouse');
    }
    static isSupported() {
        return true;
    }
}
