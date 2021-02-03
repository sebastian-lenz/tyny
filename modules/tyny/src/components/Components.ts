import { setIdleCallback, whenDomReady } from 'tyny-utils';
import { viewport } from 'tyny-services/lib/viewport';

import { ViewClass } from '../View';
import ComponentNode from './ComponentNode';

export interface Component {
  allowChildComponents?: boolean;
  selector: string;
  viewClass: ViewClass;
}

export default class Components {
  components: Component[] = [];
  isUpdateQued: boolean = false;
  pendingComponents: Component[] = [];
  root: ComponentNode | null = null;

  constructor() {
    whenDomReady().then(() => {
      this.root = new ComponentNode(document.body);

      const { pendingComponents } = this;
      for (let index = 0; index < pendingComponents.length; index++) {
        this.registerComponent(pendingComponents[index]);
      }

      pendingComponents.length = 0;
    });
  }

  createNode(element: HTMLElement): ComponentNode {
    if (!this.root) {
      throw new Error('DOM not ready.');
    }

    return this.root.createDescendant(element);
  }

  registerComponent(component: Component) {
    const { components, root } = this;
    if (!root) {
      this.pendingComponents.push(component);
    } else {
      components.push(component);
      root.registerComponent(component);

      this.initializeAllViews();
    }
  }

  private initializeAllViews() {
    const { root } = this;
    if (this.isUpdateQued) return;
    if (!root) {
      throw new Error('DOM not ready.');
    }

    this.isUpdateQued = true;

    setIdleCallback(() => {
      this.isUpdateQued = false;
      const views = root.initializeAllViews();
      if (views.length) {
        viewport().triggerResize();
      }
    });
  }
}
