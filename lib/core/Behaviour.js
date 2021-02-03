import { Lifecycle } from './Lifecycle';
export class Behaviour extends Lifecycle {
    constructor(view, options = {}) {
        super();
        this.view = view;
    }
    get el() {
        return this.view.el;
    }
    onConnected() { }
    onDestroyed() { }
    onDisconnected() { }
}
