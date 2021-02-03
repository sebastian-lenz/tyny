var Velocity = /** @class */ (function () {
    function Velocity(factory) {
        this.trackingPeriod = 100;
        this.samples = [];
        this.factory = factory;
    }
    Velocity.prototype.get = function () {
        this.revise();
        var _a = this, factory = _a.factory, samples = _a.samples;
        var result = factory();
        if (samples.length < 2) {
            return result;
        }
        var first = samples[0];
        var last = samples[samples.length - 1];
        var scale = 1 / ((last.time - first.time) / 15);
        if (!isFinite(scale)) {
            return result;
        }
        Object.keys(result).forEach(function (key) {
            // WTF: https://github.com/microsoft/TypeScript/issues/31661
            result[key] = (last.data[key] - first.data[key]) * scale;
        });
        return result;
    };
    Velocity.prototype.push = function (data) {
        this.revise();
        this.samples.push({
            data: data,
            time: Date.now(),
        });
    };
    Velocity.prototype.revise = function () {
        var _a = this, samples = _a.samples, trackingPeriod = _a.trackingPeriod;
        var now = Date.now();
        while (samples.length && now - samples[0].time > trackingPeriod) {
            samples.shift();
        }
    };
    return Velocity;
}());
export { Velocity };
