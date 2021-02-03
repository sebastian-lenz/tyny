import { memoize } from 'tyny-utils';

import keyframes from '../../keyframes';

export default memoize(function fadeOut(): string {
  return keyframes('tynyFadeOutKeyframes', {
    from: {
      opacity: '1',
    },
    to: {
      opacity: '0',
    },
  });
});
