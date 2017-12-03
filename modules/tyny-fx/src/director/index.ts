import { memoize } from 'tyny-utils';

import Director from './Director';

export default memoize(function() {
  return new Director();
});
