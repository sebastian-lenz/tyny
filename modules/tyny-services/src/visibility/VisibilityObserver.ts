import { Interval } from 'tyny-utils';

import { VisibilityTarget } from './index';
import Visibility from './Visibility';

export default class VisibilityObserver extends Interval {
  readonly target: VisibilityTarget;

  protected isVisible: boolean = false;
  protected visibility: Visibility;

  constructor(visibility: Visibility, target: VisibilityTarget) {
    super();
    this.target = target;
    this.visibility = visibility;
  }

  update(): void {
    const { target, visibility } = this;
    const { max, min } = target.getVisibilityBounds();
    this.min = min;
    this.max = max;

    const isVisible = this.intersects(visibility);
    if (this.isVisible !== isVisible) {
      this.isVisible = isVisible;
      target.setInViewport(isVisible);
    }
  }
}
