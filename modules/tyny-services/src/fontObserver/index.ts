import { memoize } from 'tyny-utils';

import FontObserver from './FontObserver';

export const fontObserver = memoize(function fontObserver() {
  return new FontObserver();
});
