import { memoize } from 'tyny-utils';

import Viewport from './Viewport';
import ViewportEvent from './ViewportEvent';

export { ViewportEvent };

export const viewport = memoize(function viewport() {
  return new Viewport();
});
