import { on } from '../event/on';
export function ready(callback) {
    if (document.readyState !== 'loading') {
        return callback();
    }
    var unbind = on(document, 'DOMContentLoaded', function () {
        unbind();
        callback();
    });
}
