import { injectConverter } from './converters';
import { propertyAccessor } from './propertyAccessor';
export var accessorFactories = [propertyAccessor];
export function createAccessor(target, property) {
    var accessor = accessorFactories.reduce(function (accessor, factory) { return (accessor ? accessor : factory(target, property)); }, undefined);
    return accessor ? injectConverter(accessor) : undefined;
}
