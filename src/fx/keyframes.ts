import { dasherize } from '../utils/lang/string/dasherize';
import { insertRule } from './utils/insertRule';
import { keyframes as keyframesName } from '../utils/env/animationProps';
import { memoize } from '../utils/lang/function/memoize';

export interface Rules {
  [name: string]: string;
}

export interface Keyframes {
  [name: string]: Rules;
}

function css(rules: Rules): string {
  return Object.keys(rules).reduce((css, key) => {
    const property = dasherize(key);
    const value = rules[key];
    return `${css}${property}: ${value};`;
  }, '');
}

export const keyframes = memoize(function keyframes(
  name: string,
  frames: Keyframes
): string {
  let innerCss = '';
  Object.keys(frames).forEach((key) => {
    innerCss += `${key} { ${css(frames[key])} }`;
  });

  insertRule(`${keyframesName} ${name} { ${innerCss} }`);
  return name;
});
