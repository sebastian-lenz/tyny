import View, { ViewOptions } from '../View';

export interface InitializerMap {
  [name: string]: Initializer;
}

export interface Initializer {
  invoke(view: View, options: ViewOptions): void;
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
 * Return or create a named initializer.
 */
export function getInitializer<T extends Initializer>(
  owner: any,
  name: string,
  factory: { (): T }
): T {
  const initializers = getInitializers(owner);

  if (initializers.hasOwnProperty(name)) {
    return <T>initializers[name];
  } else if (initializers[name]) {
    return <T>(initializers[name] = Object.create(initializers[name]));
  } else {
    return (initializers[name] = factory());
  }
}
