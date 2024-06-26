import { registerView } from './components';
import { View, ViewClass } from './View';

export type LazyViewPromise = Promise<{
  default: ViewClass;
}>;

export abstract class LazyView extends View {
  onConnected() {
    this.loadAndRegisterView();
  }

  loadAndRegisterView(): LazyViewPromise {
    return this.loadView().then((result) => {
      registerView(this.component.name, result.default, { upgrade: true });
      return result;
    });
  }

  abstract loadView(): LazyViewPromise;
}

export function registerLazyView(
  name: string,
  loadView: () => LazyViewPromise
) {
  registerView(
    name,
    class extends LazyView {
      loadView = loadView;
    }
  );
}
