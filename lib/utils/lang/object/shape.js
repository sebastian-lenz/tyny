import { isObject } from './isObject';
function has(target) {
    return function has(obj, key, { nullable = false, optional = false } = {}, validate) {
        const value = obj[key];
        const type = typeOf(value);
        return ((type === target && (validate ? validate(value) : true)) ||
            (optional === true && type === 'undefined') ||
            (nullable === true && value === null));
    };
}
export function typeOf(value) {
    const result = typeof value;
    if (result === 'object') {
        if (value === null) {
            return 'null';
        }
        else if (Array.isArray(value)) {
            return 'array';
        }
    }
    return result;
}
export const hasArray = has('array');
export const hasBoolean = has('boolean');
export const hasNumber = has('number');
export const hasObject = has('object');
export const hasString = has('string');
export class Shape {
    constructor(value) {
        if (isObject(value)) {
            this.value = value;
            this.$result = true;
        }
        else {
            this.value = {};
            this.$result = false;
        }
    }
    get isValid() {
        return this.$result;
    }
    array(key, options, validate) {
        this.$result && (this.$result = hasArray(this.value, key, options, validate));
        return this;
    }
    boolean(key, options, validate) {
        this.$result && (this.$result = hasBoolean(this.value, key, options, validate));
        return this;
    }
    enum(key, values, { optional = false, nullable = false } = {}, validate) {
        const value = this.value[key];
        const matches = values.some((v) => v === value);
        this.$result && (this.$result = (matches && (validate ? validate(value) : true)) ||
            (optional === true && typeof value === 'undefined') ||
            (nullable === true && value === null));
        return this;
    }
    number(key, options, validate) {
        this.$result && (this.$result = hasNumber(this.value, key, options, validate));
        return this;
    }
    object(key, options, validate) {
        this.$result && (this.$result = hasObject(this.value, key, options, validate));
        return this;
    }
    shape(key, validate, options) {
        return this.object(key, options, (value) => validate(Shape.for(value)).isValid);
    }
    shapes(key, validate, options) {
        return this.array(key, options, (value) => value.every((value) => validate(Shape.for(value)).isValid));
    }
    string(key, options, validate) {
        this.$result && (this.$result = hasString(this.value, key, options, validate));
        return this;
    }
    static for(value) {
        return new Shape(value);
    }
}
