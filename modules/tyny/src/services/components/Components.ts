import { setIdleCallback } from 'tyny-utils';

import { ViewClass } from '../../View';
import ComponentsNode from './ComponentsNode';

export interface Component {
  selector: string;
  viewClass: ViewClass;
}

export default class Components {
  components: Component[] = [];
  isUpdateQued: boolean = false;
  root: ComponentsNode;

  constructor(rootElement: HTMLElement) {
    this.root = new ComponentsNode(rootElement);
  }

  initializeAllViews() {
    if (this.isUpdateQued) return;
    this.isUpdateQued = true;

    setIdleCallback(() => {
      this.root.initializeAllViews();
      this.isUpdateQued = false;
    });
  }

  registerComponent(component: Component) {
    const { components, root } = this;
    components.push(component);
    root.registerComponent(component);

    this.initializeAllViews();
  }
}
