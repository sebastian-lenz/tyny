import { injectConverter } from './converters';
import { propertyAccessor } from './propertyAccessor';

export interface Accessor<T = any> {
  readonly property: string;
  readonly target: any;
  convert(value: any): T;
  getValue(): T;
  setValue(value: T): void;
}

export interface AccessorFactory {
  (target: any, property: string): MaybeAccessor;
}

export type MaybeAccessor = Accessor | undefined;

export const accessorFactories: AccessorFactory[] = [propertyAccessor];

export function createAccessor(target: any, property: string): MaybeAccessor {
  let accessor = accessorFactories.reduce(
    (accessor, factory) => (accessor ? accessor : factory(target, property)),
    undefined as MaybeAccessor
  );

  return accessor ? injectConverter(accessor) : undefined;
}
