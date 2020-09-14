import { memoize } from '../../../utils/lang/function/memoize';
import { keyframes } from '../../keyframes';

export const fadeIn = memoize(function fadeIn(): string {
  return keyframes('tynyFadeInKeyframes', {
    from: {
      opacity: '0',
    },
    to: {
      opacity: '1',
    },
  });
});
