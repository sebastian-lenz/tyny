import { dasherize } from '../utils/lang/string/dasherize';
import { isElement } from '../utils/dom/misc/isElement';
import { toBoolean } from '../utils/lang/misc/toBoolean';
import { toEnum } from '../utils/lang/misc/toEnum';
import { toFloat } from '../utils/lang/number/toFloat';
import { toInt } from '../utils/lang/number/toInt';
import { createElement, } from '../utils/dom/node/createElement';
export class ParamsAttributeReader {
    constructor(element) {
        this.element = element;
    }
    getValue(name, options) {
        const { attribute = `data-${dasherize(name)}` } = options;
        return this.element.getAttribute(attribute);
    }
    hasValue(name, options) {
        const { attribute = `data-${dasherize(name)}` } = options;
        return this.element.hasAttribute(attribute);
    }
}
export class ParamsObjectReader {
    constructor(object) {
        this.object = object;
    }
    getValue(name, options) {
        const { property = name } = options;
        return property in this.object ? this.object[property] : null;
    }
    hasValue(name, options) {
        const { property = name } = options;
        return property in this.object;
    }
}
export class Params {
    constructor(view, options) {
        this.view = view;
        this.readers = [
            new ParamsObjectReader(options),
            new ParamsAttributeReader(view.el),
        ];
    }
    read(options) {
        const { defaultValue, name } = options;
        const { readers } = this;
        for (let index = 0; index < readers.length; index++) {
            const reader = readers[index];
            if (reader.hasValue(name, options)) {
                return reader.getValue(name, options);
            }
        }
        return typeof defaultValue === 'function'
            ? defaultValue.call(this.view)
            : defaultValue;
    }
    bool(options) {
        return toBoolean(this.read(options));
    }
    element(options) {
        const value = this.read(options);
        if (isElement(value)) {
            return value;
        }
        const { view } = this;
        if (view) {
            if (typeof value === 'string') {
                const element = view.find(value);
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
    }
    enum(options) {
        const result = this.read(options);
        return result === null ? result : toEnum(options.enum, result);
    }
    instance(options) {
        const { ctor } = options;
        const value = this.read(options);
        return value instanceof ctor ? value : new ctor(value);
    }
    int(options) {
        const result = this.read(options);
        return result === null ? result : toInt(result);
    }
    number(options) {
        const result = this.read(options);
        return result === null ? null : toFloat(result);
    }
    string(options) {
        const result = this.read(options);
        return result === null ? result : `${result}`;
    }
}
