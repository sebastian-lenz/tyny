import { cssPropName } from './cssPropName';
import { getStyle } from './getStyle';
import { getStyles } from './getStyles';
import { isArray } from '../../lang/array/isArray';
import { isNumeric } from '../../lang/number/isNumeric';
import { isString } from '../../lang/string/isString';
import { isUndefined } from '../../lang/misc/isUndefined';
import { toElements } from '../misc';

const cssNumber = {
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

export type CSSPropertyValue = number | string | null;

export function css(element: tyny.ElementLike, property: string): string | null;

export function css(
  element: tyny.ElementLike,
  property: string[]
): tyny.Map<string | undefined> | undefined;

export function css(
  element: tyny.ElementLike,
  property: string,
  value: CSSPropertyValue
): HTMLElement | undefined;

export function css(
  element: tyny.ElementLike,
  property: tyny.Map<CSSPropertyValue>
): HTMLElement | undefined;

export function css(
  element: tyny.ElementLike,
  property: string | string[] | tyny.Map<CSSPropertyValue>,
  value?: CSSPropertyValue
): any {
  return toElements(element).map((element) => {
    if (isString(property)) {
      property = cssPropName(property);

      if (isUndefined(value)) {
        return getStyle(element, property);
      } else if (value === null) {
        element.style.removeProperty(property);
      } else {
        element.style[property as any] =
          isNumeric(value) && !(property in cssNumber)
            ? `${value}px`
            : `${value}`;
      }
    } else if (isArray(property)) {
      const styles: tyny.Map<string> = getStyles(element) as any;

      return property.reduce((props, property) => {
        props[property] = styles[cssPropName(property)];
        return props;
      }, {} as tyny.Map<string>);
    } else {
      for (const name in property) {
        css(element, name, property[name]);
      }
    }

    return element;
  })[0];
}
