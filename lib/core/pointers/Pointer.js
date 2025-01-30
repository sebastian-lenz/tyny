import { Velocity } from './Velocity';
const createVelocity = () => ({
    clientX: 0,
    clientY: 0,
});
export class Pointer {
    get delta() {
        return {
            x: this.clientX - this.initialClientX,
            y: this.clientY - this.initialClientY,
        };
    }
    get deltaLength() {
        const { x, y } = this.delta;
        return Math.sqrt(x * x + y * y);
    }
    constructor(options) {
        const { clientX, clientY } = options;
        this.id = options.id;
        this.adapter = options.adapter;
        this.type = options.type;
        this.clientX =
            this.initialClientX =
                this.initialTransformClientX =
                    this.lastClientX =
                        clientX;
        this.clientY =
            this.initialClientY =
                this.initialTransformClientY =
                    this.lastClientY =
                        clientY;
        this.velocity = new Velocity(createVelocity);
        this.velocity.push({ clientX, clientY });
    }
    getVelocity() {
        const { clientX, clientY } = this.velocity.get();
        return { x: clientX, y: clientY };
    }
    move({ clientX, clientY }) {
        this.lastClientX = this.clientX;
        this.lastClientY = this.clientY;
        this.clientX = clientX;
        this.clientY = clientY;
        this.velocity.push({ clientX, clientY });
    }
    resetInitialPosition() {
        this.initialClientX = this.clientX;
        this.initialClientY = this.clientY;
    }
}
