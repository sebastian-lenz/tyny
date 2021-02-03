import { once } from '../../../utils/dom/event';
import { Url } from '../../../utils/types/Url';
import { Adapter } from './Adapter';
export class IFrameAdapter extends Adapter {
    constructor() {
        super(...arguments);
        this.apiPromise = null;
    }
    get url() {
        return new Url(this.el.src);
    }
    set url(value) {
        this.el.src = value.toString();
    }
    enableApi() {
        if (this.apiPromise) {
            return this.apiPromise;
        }
        return (this.apiPromise = this.createApi());
    }
    // Protected methods
    // -----------------
    awaitMessage(callback) {
        return new Promise((resolve) => once(window, 'message', (event) => resolve(event.data), {
            condition: ({ data }) => {
                try {
                    data = JSON.parse(data);
                    return data && callback(data);
                }
                catch (e) {
                    // Unreadable message
                }
            },
        }));
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
