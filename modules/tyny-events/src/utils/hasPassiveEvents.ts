import { memoize } from 'tyny-utils';

export default memoize(function hasPassiveEvents(): boolean {
  let result = false;
  try {
    const listener = () => null;
    const opts = Object.defineProperty({}, 'passive', {
      get: () => (result = true),
    });

    window.addEventListener('test', listener, opts);
    window.removeEventListener('test', listener, opts);
  } catch (e) {}

  return result;
});
