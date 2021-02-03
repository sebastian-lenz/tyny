import { unitConverter } from './unitConverter';
export const converterFactories = [unitConverter];
export function injectConverter(accessor) {
    return converterFactories.reduce((accessor, factory) => factory(accessor), accessor);
}
