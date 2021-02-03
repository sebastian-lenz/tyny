import { whenLoaded } from '../../utils/views/loadable';
var Sequencer = /** @class */ (function () {
    function Sequencer(options) {
        if (options === void 0) { options = {}; }
        this.callbackContext = null;
        this.dismissCallback = null;
        this.endCallback = null;
        this.startCallback = null;
        this.sequence = null;
        this.shelved = null;
        Object.assign(this, options);
    }
    Sequencer.prototype.inTransition = function () {
        return !!this.sequence;
    };
    Sequencer.prototype.transist = function (options) {
        var _a = this, callbackContext = _a.callbackContext, dismissCallback = _a.dismissCallback, sequence = _a.sequence;
        if (sequence) {
            if (this.shelved && dismissCallback) {
                dismissCallback.call(callbackContext, this.shelved);
            }
            this.shelved = options;
        }
        else {
            this.sequence = this.createSequence(options);
        }
    };
    Sequencer.prototype.createSequence = function (options) {
        var _this = this;
        var transition = options.transition, from = options.from, to = options.to;
        return whenLoaded(to)
            .then(function () {
            _this.onTransitionStart(options);
            return transition(from, to);
        })
            .then(function () { return _this.onTransitionEnd(options); });
    };
    Sequencer.prototype.onTransitionEnd = function (options) {
        var _a = this, callbackContext = _a.callbackContext, shelved = _a.shelved, endCallback = _a.endCallback;
        var from = options.from, to = options.to;
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
    };
    Sequencer.prototype.onTransitionStart = function (options) {
        var from = options.from, to = options.to;
        var _a = this, callbackContext = _a.callbackContext, startCallback = _a.startCallback;
        if (startCallback) {
            startCallback.call(callbackContext, options);
        }
        if (from) {
            from.classList.add('sequenceFrom');
        }
        if (to) {
            to.classList.add('sequenceTo');
        }
    };
    return Sequencer;
}());
export { Sequencer };
