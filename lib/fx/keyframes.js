import { dasherize } from '../utils/lang/string/dasherize';
import { insertRule } from './utils/insertRule';
import { keyframes as keyframesName } from '../utils/env/animationProps';
import { memoize } from '../utils/lang/function/memoize';
function css(rules) {
    return Object.keys(rules).reduce((css, key) => {
        const property = dasherize(key);
        const value = rules[key];
        return `${css}${property}: ${value};`;
    }, '');
}
export const keyframes = memoize(function keyframes(name, frames) {
    let innerCss = '';
    Object.keys(frames).forEach((key) => {
        innerCss += `${key} { ${css(frames[key])} }`;
    });
    insertRule(`${keyframesName} ${name} { ${innerCss} }`);
    return name;
});
