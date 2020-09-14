import { Accessor } from '../index';
import { unitConverter } from './unitConverter';

export interface ConverterFactory {
  (accessor: Accessor): Accessor;
}

export const converterFactories: ConverterFactory[] = [unitConverter];

export function injectConverter(accessor: Accessor): Accessor {
  return converterFactories.reduce(
    (accessor, factory) => factory(accessor),
    accessor
  );
}
