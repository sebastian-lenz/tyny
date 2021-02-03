import { cssPropName } from './cssPropName';
import { getStyle } from './getStyle';
import { getStyles } from './getStyles';
import { isArray } from '../../lang/array/isArray';
import { isNumeric } from '../../lang/number/isNumeric';
import { isString } from '../../lang/string/isString';
import { isUndefined } from '../../lang/misc/isUndefined';
import { toElements } from '../misc';
var cssNumber = {
    'animation-iteration-count': true,
    'column-count': true,
    'fill-opacity': true,
    'flex-grow': true,
    'flex-shrink': true,
    'font-weight': true,
    'line-height': true,
    opacity: true,
    order: true,
    orphans: true,
    'stroke-dasharray': true,
    'stroke-dashoffset': true,
    widows: true,
    'z-index': true,
    zoom: true,
};
export function css(element, property, value) {
    return toElements(element).map(function (element) {
        if (isString(property)) {
            property = cssPropName(property);
            if (isUndefined(value)) {
                return getStyle(element, property);
            }
            else if (value === null) {
                element.style.removeProperty(property);
            }
            else {
                element.style[property] =
                    isNumeric(value) && !(property in cssNumber)
                        ? value + "px"
                        : "" + value;
            }
        }
        else if (isArray(property)) {
            var styles_1 = getStyles(element);
            return property.reduce(function (props, property) {
                props[property] = styles_1[cssPropName(property)];
                return props;
            }, {});
        }
        else {
            for (var name_1 in property) {
                css(element, name_1, property[name_1]);
            }
        }
        return element;
    })[0];
}
