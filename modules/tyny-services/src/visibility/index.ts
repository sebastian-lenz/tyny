import { IntervalType } from 'tyny-utils';

import Visibility from './Visibility';

export interface VisibilityTarget {
  getVisibilityBounds(): IntervalType;
  setInViewport(value: boolean): void;
}

export default new Visibility();
