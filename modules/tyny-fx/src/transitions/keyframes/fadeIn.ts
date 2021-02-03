import { memoize } from 'tyny-utils';

import keyframes from '../../keyframes';

export default memoize(function fadeIn(): string {
  return keyframes('tynyFadeInKeyframes', {
    from: {
      opacity: '0',
    },
    to: {
      opacity: '1',
    },
  });
});
