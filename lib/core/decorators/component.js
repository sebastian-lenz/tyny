import { registerView } from '../components';
export function component(options = {}) {
    return function (ctor) {
        registerView(options.name || ctor.name, ctor, options);
    };
}
