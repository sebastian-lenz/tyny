import { injectConverter } from './converters';
import { propertyAccessor } from './propertyAccessor';
export const accessorFactories = [propertyAccessor];
export function createAccessor(target, property) {
    let accessor = accessorFactories.reduce((accessor, factory) => (accessor ? accessor : factory(target, property)), undefined);
    return accessor ? injectConverter(accessor) : undefined;
}
