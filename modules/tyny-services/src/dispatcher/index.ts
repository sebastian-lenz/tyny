import { memoize } from 'tyny-utils';

import Dispatcher from './Dispatcher';
import DispatcherEvent from './DispatcherEvent';

export { DispatcherEvent };

export const dispatcher = memoize(function dispatcher() {
  return new Dispatcher();
});
