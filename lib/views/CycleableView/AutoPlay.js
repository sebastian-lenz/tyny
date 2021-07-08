import { Behaviour } from '../../core/Behaviour';
import { transistEvent } from './index';
import { off, on } from '../../utils/dom/event/on';
export class AutoPlay extends Behaviour {
    constructor(view, options = {}) {
        super(view, Object.assign({ interval: 5000 }, options));
        this.id = Math.round(Math.random() * 1024);
        this.isStarted = false;
        this._timeout = null;
        this.onTimeout = () => {
            const { view } = this;
            this._timeout = null;
            view.currentIndex = view.currentIndex + 1;
            this.start();
        };
        this.onTransist = () => {
            if (this._timeout) {
                this.start();
            }
        };
        const { autoStart = true, interval = 5000 } = options;
        this.interval = interval;
        on(this.el, transistEvent, this.onTransist);
        if (autoStart) {
            this.start();
        }
    }
    pause() {
        const { _timeout } = this;
        if (_timeout) {
            clearTimeout(_timeout);
            this._timeout = null;
        }
        this.isStarted = false;
    }
    start() {
        const { interval, onTimeout, _timeout } = this;
        if (_timeout) {
            clearTimeout(_timeout);
        }
        this.isStarted = true;
        this._timeout = window.setTimeout(onTimeout, interval);
    }
    onDisconnected() {
        off(this.el, transistEvent, this.onTransist);
        const { _timeout } = this;
        if (_timeout) {
            clearTimeout(_timeout);
        }
        this._timeout = null;
    }
}
