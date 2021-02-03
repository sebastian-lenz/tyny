import { AbstractAdapter } from './AbstractAdapter';
import { isUndefined } from '../../../utils/lang/misc';
let isSupported = undefined;
const id = (event) => `pointer-${event.pointerId}`;
export class PointerAdapter extends AbstractAdapter {
    getEvents() {
        return {
            pointerdown: this.handlePointerDown,
        };
    }
    getTrackingEvents() {
        return {
            pointermove: this.handlePointerMove,
            pointerup: this.handlePointerUp,
            pointercancel: this.handlePointerUp,
        };
    }
    handlePointerDown(event) {
        if (event.button !== 0) {
            return;
        }
        this.pointerList.addPointer(event, {
            adapter: this,
            clientX: event.clientX,
            clientY: event.clientY,
            id: id(event),
            type: event.pointerType,
        });
    }
    handlePointerMove(event) {
        this.pointerList.movePointer(event, id(event), {
            clientX: event.clientX,
            clientY: event.clientY,
        });
    }
    handlePointerUp(event) {
        this.pointerList.removePointer(event, id(event));
    }
    static isSupported() {
        if (!isUndefined(isSupported)) {
            return isSupported;
        }
        isSupported = 'PointerEvent' in window;
        if (isSupported) {
            try {
                window.addEventListener('pointermove', function () { }, {
                    passive: false,
                });
            }
            catch (e) {
                window.addEventListener('pointermove', function () { });
            }
        }
        return isSupported;
    }
}
