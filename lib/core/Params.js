import { dasherize } from '../utils/lang/string/dasherize';
import { isElement } from '../utils/dom/misc/isElement';
import { toBoolean } from '../utils/lang/misc/toBoolean';
import { toEnum } from '../utils/lang/misc/toEnum';
import { toFloat } from '../utils/lang/number/toFloat';
import { toInt } from '../utils/lang/number/toInt';
import { createElement, } from '../utils/dom/node/createElement';
var ParamsAttributeReader = /** @class */ (function () {
    function ParamsAttributeReader(element) {
        this.element = element;
    }
    ParamsAttributeReader.prototype.getValue = function (name, options) {
        var _a = options.attribute, attribute = _a === void 0 ? "data-" + dasherize(name) : _a;
        return this.element.getAttribute(attribute);
    };
    ParamsAttributeReader.prototype.hasValue = function (name, options) {
        var _a = options.attribute, attribute = _a === void 0 ? "data-" + dasherize(name) : _a;
        return this.element.hasAttribute(attribute);
    };
    return ParamsAttributeReader;
}());
export { ParamsAttributeReader };
var ParamsObjectReader = /** @class */ (function () {
    function ParamsObjectReader(object) {
        this.object = object;
    }
    ParamsObjectReader.prototype.getValue = function (name, options) {
        var _a = options.property, property = _a === void 0 ? name : _a;
        return property in this.object ? this.object[property] : null;
    };
    ParamsObjectReader.prototype.hasValue = function (name, options) {
        var _a = options.property, property = _a === void 0 ? name : _a;
        return property in this.object;
    };
    return ParamsObjectReader;
}());
export { ParamsObjectReader };
var Params = /** @class */ (function () {
    function Params(view, options) {
        this.view = view;
        this.readers = [
            new ParamsObjectReader(options),
            new ParamsAttributeReader(view.el),
        ];
    }
    Params.prototype.read = function (options) {
        var defaultValue = options.defaultValue, name = options.name;
        var readers = this.readers;
        for (var index = 0; index < readers.length; index++) {
            var reader = readers[index];
            if (reader.hasValue(name, options)) {
                return reader.getValue(name, options);
            }
        }
        return typeof defaultValue === 'function'
            ? defaultValue.call(this.view)
            : defaultValue;
    };
    Params.prototype.bool = function (options) {
        return toBoolean(this.read(options));
    };
    Params.prototype.element = function (options) {
        var value = this.read(options);
        if (isElement(value)) {
            return value;
        }
        var view = this.view;
        if (view) {
            if (typeof value === 'string') {
                var element = view.find(value);
                if (element) {
                    return element;
                }
            }
            if (options.tagName) {
                return createElement({
                    attributes: options.attributes,
                    appendTo: options.appendTo || view.el,
                    className: options.className,
                    tagName: options.tagName,
                });
            }
        }
        return null;
    };
    Params.prototype.enum = function (options) {
        var result = this.read(options);
        return result === null ? result : toEnum(options.enum, result);
    };
    Params.prototype.instance = function (options) {
        var ctor = options.ctor;
        var value = this.read(options);
        return value instanceof ctor ? value : new ctor(value);
    };
    Params.prototype.int = function (options) {
        var result = this.read(options);
        return result === null ? result : toInt(result);
    };
    Params.prototype.number = function (options) {
        var result = this.read(options);
        return result === null ? null : toFloat(result);
    };
    Params.prototype.string = function (options) {
        var result = this.read(options);
        return result === null ? result : "" + result;
    };
    return Params;
}());
export { Params };
