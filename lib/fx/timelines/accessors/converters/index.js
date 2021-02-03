import { unitConverter } from './unitConverter';
export var converterFactories = [unitConverter];
export function injectConverter(accessor) {
    return converterFactories.reduce(function (accessor, factory) { return factory(accessor); }, accessor);
}
