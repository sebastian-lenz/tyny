import { __assign, __rest } from "tslib";
export function property(options) {
    if (options === void 0) { options = {}; }
    return function (target, name) {
        var param = options.param;
        var property = Object.getOwnPropertyDescriptor(target, name) || {};
        var get = property.get, desc = __rest(property, ["get"]);
        var properties = target.hasOwnProperty('_properties')
            ? target._properties
            : (target._properties = __assign({}, target._properties));
        properties[name] = __assign(__assign({}, options), { name: name });
        Object.defineProperty(target, name, __assign(__assign({}, desc), { get: function () {
                var values = this._watchValues || (this._watchValues = {});
                if (name in values) {
                    return values[name];
                }
                if (param) {
                    var type = param.type, options_1 = __rest(param, ["type"]);
                    return (values[name] = this.params[type](__assign(__assign({ defaultValue: get }, options_1), { name: name })));
                }
                return (values[name] = get ? get() : undefined);
            } }));
    };
}
