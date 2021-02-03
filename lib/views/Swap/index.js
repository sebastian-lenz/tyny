import { fade } from '../../fx/transitions/fade';
import { removeNode } from '../../utils/dom/node';
import { Sequencer } from '../Slideshow/Sequencer';
import { View } from '../../core/View';
import { transistDimensions, } from '../../fx/transistDimensions';
export const swapEndEvent = 'tyny:swapEnd';
export const swapStartEvent = 'tyny:swapStart';
export class Swap extends View {
    constructor(options = {}) {
        super(options);
        this._content = null;
        this.autoAppend = options.autoAppend || false;
        this.autoRemove = options.autoRemove || false;
        this.dimensions = options.dimensions || null;
        this.selectedClass = options.selectedClass || 'selected';
        this.transition = options.transition || fade();
        this._content = this.params.element({ name: 'content' }) || null;
        this.viewport = this.params.element({
            defaultValue: this.el,
            name: 'viewport',
        });
        this.sequencer = new Sequencer({
            callbackContext: this,
            dismissCallback: this.onTransitionDismiss,
            endCallback: this.onTransitionEnd,
            startCallback: this.onTransitionStart,
        });
    }
    get content() {
        return this._content;
    }
    set content(value) {
        this.setContent(value);
    }
    setContent(value = null, options = {}) {
        const { dimensions, content, sequencer, transition } = this;
        if (content === value) {
            return;
        }
        this._content = value;
        sequencer.transist(Object.assign(Object.assign({ transition,
            dimensions }, options), { from: content, to: value }));
    }
    onTransitionDismiss({ to }) {
        if (to && this.autoRemove) {
            removeNode(to);
        }
    }
    onTransitionStart({ dimensions, from, to }) {
        const { autoAppend, selectedClass, viewport } = this;
        const callback = () => {
            if (from)
                from.classList.remove(selectedClass);
            if (to)
                to.classList.add(selectedClass);
        };
        if (to && autoAppend) {
            viewport.appendChild(to);
        }
        if (dimensions) {
            transistDimensions(this.viewport, callback, dimensions);
        }
        else {
            callback();
        }
        this.trigger(swapStartEvent, {
            from,
            target: this,
            to,
        });
    }
    onTransitionEnd({ from, to }) {
        if (from && this.autoRemove) {
            removeNode(from);
        }
        this.trigger(swapEndEvent, {
            from,
            target: this,
            to,
        });
    }
}
