import { isObject } from './isObject';
function has(target) {
    function has(obj, key, optional, validate) {
        const value = obj[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        return ((type === target && (validate ? validate(value) : true)) ||
            (optional === true && type === 'undefined'));
    }
    return has;
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
    array(key, optional, validate) {
        this.$result && (this.$result = hasArray(this.value, key, optional, validate));
        return this;
    }
    boolean(key, optional, validate) {
        this.$result && (this.$result = hasBoolean(this.value, key, optional, validate));
        return this;
    }
    enum(key, values, optional, validate) {
        const value = this.value[key];
        const matches = values.some((v) => v === value);
        this.$result && (this.$result = (matches && (validate ? validate(value) : true)) ||
            (optional === true && typeof value === 'undefined'));
        return this;
    }
    number(key, optional, validate) {
        this.$result && (this.$result = hasNumber(this.value, key, optional, validate));
        return this;
    }
    object(key, optional, validate) {
        this.$result && (this.$result = hasObject(this.value, key, optional, validate));
        return this;
    }
    shape(key, validate, optional) {
        return this.object(key, optional, (value) => validate(Shape.for(value)).isValid);
    }
    shapes(key, validate, optional) {
        return this.array(key, optional, (value) => value.every((value) => validate(Shape.for(value)).isValid));
    }
    string(key, optional, validate) {
        this.$result && (this.$result = hasString(this.value, key, optional, validate));
        return this;
    }
    static for(value) {
        return new Shape(value);
    }
}
