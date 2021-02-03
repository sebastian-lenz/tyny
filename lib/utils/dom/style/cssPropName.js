import { hyphenate } from '../../lang/string/hyphenate';
const cssProps = {};
const cssPrefixes = ['webkit', 'moz', 'ms'];
function vendorPropName(name) {
    name = hyphenate(name);
    const { style } = document.documentElement;
    if (name in style) {
        return name;
    }
    let index = cssPrefixes.length;
    let prefixedName;
    while (index--) {
        prefixedName = `-${cssPrefixes[index]}-${name}`;
        if (prefixedName in style) {
            return prefixedName;
        }
    }
    return name;
}
export function cssPropName(name) {
    let result = cssProps[name];
    if (!result) {
        result = cssProps[name] = vendorPropName(name);
    }
    return result;
}
