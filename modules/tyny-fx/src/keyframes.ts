import { dasherize, memoize } from 'tyny-utils';
import animationProps from 'tyny-utils/lib/vendors/animationProps';

import insertRule from './utils/insertRule';

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

export default memoize(function keyframes(
  name: string,
  frames: Keyframes
): string {
  const { hasAnimation, keyframePrefix } = animationProps();
  if (!hasAnimation) {
    return name;
  }

  let innerCss = '';
  Object.keys(frames).forEach(key => {
    innerCss += `${key} { ${css(frames[key])} }`;
  });

  insertRule(`@${keyframePrefix}keyframes ${name} { ${innerCss} }`);
  return name;
});
