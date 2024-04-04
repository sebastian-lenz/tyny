import { registerView } from './components';
import { View } from './View';
export class LazyView extends View {
    onConnected() {
        this.loadAndRegisterView();
    }
    loadAndRegisterView() {
        return this.loadView().then((result) => {
            registerView(this.component.name, result.default, { upgrade: true });
            return result;
        });
    }
}
export function registerLazyView(name, loadView) {
    registerView(name, class extends LazyView {
        constructor() {
            super(...arguments);
            this.loadView = loadView;
        }
    });
}
