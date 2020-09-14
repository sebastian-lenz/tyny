import { clamp, isNumber, toNumber } from '../../lang/number';
import { isString } from '../../lang/string/isString';
import { toNodes } from '../misc';
import { childIndex } from './childIndex';

export function getIndex(
  value: number | string | 'next' | 'previous',
  elements: tyny.ElementLike,
  current: number = 0,
  finite: boolean = false
) {
  elements = toNodes(elements);
  const { length } = elements;
  let offset: number;

  if (isString(value) || isNumber(value)) {
    offset = toNumber(value) || 0;
  } else if (value === 'next') {
    offset = current + 1;
  } else if (value === 'previous') {
    offset = current - 1;
  } else {
    offset = childIndex(elements, value);
  }

  if (finite) {
    return clamp(offset, 0, length - 1);
  }

  offset %= length;
  return offset < 0 ? offset + length : offset;
}
