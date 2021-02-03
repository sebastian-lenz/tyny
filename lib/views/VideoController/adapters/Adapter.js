var nextUid = 1465;
var Adapter = /** @class */ (function () {
    function Adapter(el) {
        this.el = el;
        this.uid = nextUid++;
    }
    Adapter.prototype.enableApi = function () {
        return Promise.resolve();
    };
    Adapter.prototype.getCurrentTime = function () {
        return 0;
    };
    Adapter.prototype.getDuration = function () {
        return 0;
    };
    Adapter.prototype.getVolume = function () {
        return 0;
    };
    Adapter.prototype.mute = function () { };
    Adapter.prototype.pause = function () { };
    Adapter.prototype.play = function () { };
    Adapter.prototype.setCurrentTime = function (value, options) {
        if (options === void 0) { options = {}; }
    };
    Adapter.prototype.setVolume = function (volume) { };
    Adapter.prototype.unmute = function () { };
    return Adapter;
}());
export { Adapter };
