import { hyphenate } from '../../lang/string/hyphenate';
var cssProps = {};
var cssPrefixes = ['webkit', 'moz', 'ms'];
function vendorPropName(name) {
    name = hyphenate(name);
    var style = document.documentElement.style;
    if (name in style) {
        return name;
    }
    var index = cssPrefixes.length;
    var prefixedName;
    while (index--) {
        prefixedName = "-" + cssPrefixes[index] + "-" + name;
        if (prefixedName in style) {
            return prefixedName;
        }
    }
    return name;
}
export function cssPropName(name) {
    var result = cssProps[name];
    if (!result) {
        result = cssProps[name] = vendorPropName(name);
    }
    return result;
}
