import { Adapter } from './Adapter';
import { Url } from '../../../utils/types/Url';
import { once } from '../../../utils/dom/event';
export class IFrameAdapter extends Adapter {
    constructor() {
        super(...arguments);
        this.apiPromise = null;
        this.listeners = [];
    }
    get url() {
        return new Url(this.el.src);
    }
    set url(value) {
        this.el.src = value.toString();
    }
    destroy() {
        const { listeners } = this;
        listeners.forEach((listener) => listener());
        listeners.length = 0;
    }
    enableApi() {
        if (this.apiPromise) {
            return this.apiPromise;
        }
        return (this.apiPromise = this.createApi());
    }
    awaitMessage(callback) {
        return new Promise((resolve) => {
            const onMessage = (event) => {
                resolve(event.data);
                this.listeners = this.listeners.filter((value) => value !== listener);
            };
            const condition = ({ data }) => {
                try {
                    data = JSON.parse(data);
                    return data && callback(data);
                }
                catch (e) {
                }
            };
            const listener = once(window, 'message', onMessage, { condition });
            this.listeners.push(listener);
        });
    }
    post(cmd) {
        this.enableApi().then(() => {
            this.postNative(cmd);
        });
    }
    postNative(cmd) {
        const { contentWindow } = this.el;
        if (!contentWindow) {
            return;
        }
        try {
            contentWindow.postMessage(JSON.stringify(Object.assign({ event: 'command' }, cmd)), '*');
        }
        catch (e) { }
    }
}
