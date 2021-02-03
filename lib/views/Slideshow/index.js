import { AutoPlay } from '../CycleableView/AutoPlay';
import { CycleableView } from '../CycleableView';
import { dissolve } from '../../fx/transitions/dissolve';
import { Sequencer } from './Sequencer';
import { BrowseBehaviour } from './BrowseBehaviour';
export const slideshowDismissEvent = 'tyny:slideshowDismiss';
export const slideshowEndEvent = 'tyny:slideshowEnd';
export const slideshowStartEvent = 'tyny:slideshowStart';
export class Slideshow extends CycleableView {
    constructor(options) {
        super(Object.assign({ initialIndex: 0, isLooped: true }, options));
        this.wasAutoPlaying = false;
        this.autoPlay = this.addBehaviour(AutoPlay, options.autoPlay);
        this.browseBehaviour = this.addBehaviour(BrowseBehaviour, options.browse);
        this.defaultTransition = options.transition || dissolve();
        this.sequencer = new Sequencer({
            callbackContext: this,
            dismissCallback: this.onTransitionDismiss,
            endCallback: this.onTransitionEnd,
            startCallback: this.onTransitionStart,
        });
    }
    get inTransition() {
        return this.sequencer.inTransition();
    }
    immediate(value) {
        this.transist(value, { transition: () => Promise.resolve() });
    }
    onBrowseBegin() {
        if (this.inTransition) {
            return false;
        }
        this.wasAutoPlaying = this.autoPlay.isStarted;
        this.autoPlay.pause();
        return true;
    }
    onBrowseEnd() {
        if (this.wasAutoPlaying) {
            this.autoPlay.start();
        }
    }
    onTransition(from, to, options = {}) {
        const { defaultTransition, sequencer } = this;
        const transition = from ? defaultTransition : () => Promise.resolve();
        sequencer.transist(Object.assign({ transition,
            from,
            to }, options));
    }
    onTransitionDismiss({ from, to }) {
        this.trigger(slideshowDismissEvent, {
            from,
            target: this,
            to,
        });
    }
    onTransitionEnd({ from, to }) {
        this.trigger(slideshowEndEvent, {
            from,
            target: this,
            to,
        });
    }
    onTransitionStart({ from, to }) {
        if (from) {
            from.classList.remove('selected');
        }
        if (to) {
            to.classList.add('selected');
        }
        this.trigger(slideshowStartEvent, {
            from,
            target: this,
            to,
        });
    }
}
