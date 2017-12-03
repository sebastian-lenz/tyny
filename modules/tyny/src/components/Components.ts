import { setIdleCallback } from 'tyny-utils';
import { viewport } from 'tyny-services/lib/viewport';

import { ViewClass } from '../View';
import ComponentNode from './ComponentNode';

export interface Component {
  allowChildComponents: boolean;
  selector: string;
  viewClass: ViewClass;
}

export default class Components {
  components: Component[] = [];
  isUpdateQued: boolean = false;
  root: ComponentNode;

  constructor(rootElement: HTMLElement) {
    this.root = new ComponentNode(rootElement);
  }

  createNode(element: HTMLElement): ComponentNode {
    return this.root.createDescendant(element);
  }

  initializeAllViews() {
    if (this.isUpdateQued) return;
    this.isUpdateQued = true;

    setIdleCallback(() => {
      this.isUpdateQued = false;
      const views = this.root.initializeAllViews();
      if (views.length) {
        viewport().triggerResize();
      }
    });
  }

  registerComponent(component: Component) {
    const { components, root } = this;
    components.push(component);
    root.registerComponent(component);

    this.initializeAllViews();
  }
}
