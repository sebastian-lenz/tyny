import { Velocity } from './Velocity';
var createVelocity = function () { return ({
    clientX: 0,
    clientY: 0,
}); };
var Pointer = /** @class */ (function () {
    function Pointer(options) {
        var clientX = options.clientX, clientY = options.clientY;
        this.id = options.id;
        this.adapter = options.adapter;
        this.type = options.type;
        this.clientX = this.initialClientX = this.initialTransformClientX = this.lastClientX = clientX;
        this.clientY = this.initialClientY = this.initialTransformClientY = this.lastClientY = clientY;
        this.velocity = new Velocity(createVelocity);
        this.velocity.push({ clientX: clientX, clientY: clientY });
    }
    Object.defineProperty(Pointer.prototype, "delta", {
        get: function () {
            return {
                x: this.clientX - this.initialClientX,
                y: this.clientY - this.initialClientY,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "deltaLength", {
        get: function () {
            var _a = this.delta, x = _a.x, y = _a.y;
            return Math.sqrt(x * x + y * y);
        },
        enumerable: false,
        configurable: true
    });
    Pointer.prototype.move = function (_a) {
        var clientX = _a.clientX, clientY = _a.clientY;
        this.lastClientX = this.clientX;
        this.lastClientY = this.clientY;
        this.clientX = clientX;
        this.clientY = clientY;
        this.velocity.push({ clientX: clientX, clientY: clientY });
    };
    Pointer.prototype.resetInitialPosition = function () {
        this.initialClientX = this.clientX;
        this.initialClientY = this.clientY;
    };
    return Pointer;
}());
export { Pointer };
