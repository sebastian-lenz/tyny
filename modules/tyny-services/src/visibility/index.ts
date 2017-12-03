import { IntervalType, memoize } from 'tyny-utils';

import Visibility from './Visibility';

export interface VisibilityTarget {
  getVisibilityBounds(): IntervalType;
  setInViewport(value: boolean): void;
}

export const visibility = memoize(function visibility() {
  return new Visibility();
});
