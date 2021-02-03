import { memoize } from 'tyny-utils';

import GoogleMaps from './GoogleMaps';

export const googleMaps = memoize(function dispatcher() {
  return new GoogleMaps();
});
