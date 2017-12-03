import View, { ViewOptions } from '../View';

export interface InitializerMap {
  [name: string]: Initializer;
}

export interface Initializer {
  (view: View, options: ViewOptions): void;
}

/**
 * Return the initializers of the given class.
 */
export function getInitializers(owner: any): InitializerMap {
  if (owner.hasOwnProperty('_initializers')) {
    return owner._initializers;
  } else if (owner._initializers) {
    return (owner._initializers = Object.create(owner._initializers));
  } else {
    return (owner._initializers = {});
  }
}

/**
 * Sets an initializer.
 */
export function setInitializer(
  owner: any,
  name: string,
  initializer: Initializer
) {
  const initializers = getInitializers(owner);
  initializers[name] = initializer;
}
