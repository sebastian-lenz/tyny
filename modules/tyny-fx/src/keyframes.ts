import { dasherize, memoize } from 'tyny-utils';
import animationProps from 'tyny-utils/lib/vendors/animationProps';

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

  const keyframes = `@${keyframePrefix}keyframes ${name} { ${innerCss} }`;

  if (document.styleSheets && document.styleSheets.length) {
    (document.styleSheets[0] as CSSStyleSheet).insertRule(keyframes, 0);
  } else {
    var styleSheet = document.createElement('style');
    styleSheet.innerHTML = keyframes;
    document.head.appendChild(styleSheet);
  }

  return name;
});
