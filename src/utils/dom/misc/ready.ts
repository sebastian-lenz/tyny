import { on } from '../event/on';

export function ready(callback: Function) {
  if (document.readyState !== 'loading') {
    return callback();
  }

  const unbind = on(document, 'DOMContentLoaded', () => {
    unbind();
    callback();
  });
}
