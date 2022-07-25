import { registerView } from './components';
import { View } from './View';
export class LazyView extends View {
    onConnected() {
        this.load().then((result) => {
            registerView(this.component.name, result.default, { upgrade: true });
        });
    }
}
