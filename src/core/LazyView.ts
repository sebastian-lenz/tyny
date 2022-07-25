import { registerView } from './components';
import { View, ViewClass } from './View';

export type LazyViewPromise = Promise<{
  default: ViewClass;
}>;

export abstract class LazyView extends View {
  onConnected() {
    this.load().then((result) => {
      registerView(this.component.name, result.default, { upgrade: true });
    });
  }

  abstract load(): LazyViewPromise;
}
