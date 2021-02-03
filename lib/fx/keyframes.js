import { dasherize } from '../utils/lang/string/dasherize';
import { insertRule } from './utils/insertRule';
import { keyframes as keyframesName } from '../utils/env/animationProps';
import { memoize } from '../utils/lang/function/memoize';
function css(rules) {
    return Object.keys(rules).reduce(function (css, key) {
        var property = dasherize(key);
        var value = rules[key];
        return "" + css + property + ": " + value + ";";
    }, '');
}
export var keyframes = memoize(function keyframes(name, frames) {
    var innerCss = '';
    Object.keys(frames).forEach(function (key) {
        innerCss += key + " { " + css(frames[key]) + " }";
    });
    insertRule(keyframesName + " " + name + " { " + innerCss + " }");
    return name;
});
