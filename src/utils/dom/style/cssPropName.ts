import { hyphenate } from '../../lang/string/hyphenate';

const cssProps: tyny.Map<string> = {};
const cssPrefixes = ['webkit', 'moz', 'ms'];

function vendorPropName(name: string): string {
  name = hyphenate(name);

  const { style } = document.documentElement;
  if (name in style) {
    return name;
  }

  let index = cssPrefixes.length;
  let prefixedName: string;

  while (index--) {
    prefixedName = `-${cssPrefixes[index]}-${name}`;
    if (prefixedName in style) {
      return prefixedName;
    }
  }

  return name;
}

export function cssPropName(name: string): string {
  let result = cssProps[name];
  if (!result) {
    result = cssProps[name] = vendorPropName(name);
  }

  return result;
}
