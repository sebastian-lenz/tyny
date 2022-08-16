import { whenLoaded } from '../../utils/views/loadable';
export class Sequencer {
    constructor(options = {}) {
        this.callbackContext = null;
        this.dismissCallback = null;
        this.endCallback = null;
        this.startCallback = null;
        this.sequence = null;
        this.shelved = null;
        Object.assign(this, options);
    }
    createSequence(options) {
        const { transition, from, to } = options;
        return whenLoaded(to)
            .then(() => this.onTransitionStart(options))
            .then(() => transition(from, to))
            .then(() => this.onTransitionEnd(options));
    }
    inTransition() {
        return !!this.sequence;
    }
    onTransitionEnd(options) {
        const { callbackContext, shelved, endCallback } = this;
        const { from, to } = options;
        this.shelved = null;
        if (from) {
            from.classList.remove('sequenceFrom');
        }
        if (to) {
            to.classList.remove('sequenceTo');
        }
        if (shelved) {
            shelved.from = options.to;
            this.sequence = this.createSequence(shelved);
        }
        else {
            this.sequence = null;
        }
        if (endCallback) {
            endCallback.call(callbackContext, options);
        }
    }
    onTransitionStart(options) {
        const { from, to } = options;
        const { callbackContext, startCallback } = this;
        if (startCallback) {
            startCallback.call(callbackContext, options);
        }
        if (from) {
            from.classList.add('sequenceFrom');
        }
        if (to) {
            to.classList.add('sequenceTo');
        }
    }
    transist(options) {
        const { callbackContext, dismissCallback, sequence } = this;
        if (sequence) {
            if (this.shelved && dismissCallback) {
                dismissCallback.call(callbackContext, this.shelved);
            }
            this.shelved = options;
        }
        else {
            this.sequence = this.createSequence(options);
        }
    }
}
