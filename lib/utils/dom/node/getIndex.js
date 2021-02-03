import { clamp, isNumber, toNumber } from '../../lang/number';
import { isString } from '../../lang/string/isString';
import { toNodes } from '../misc';
import { childIndex } from './childIndex';
export function getIndex(value, elements, current, finite) {
    if (current === void 0) { current = 0; }
    if (finite === void 0) { finite = false; }
    elements = toNodes(elements);
    var length = elements.length;
    var offset;
    if (isString(value) || isNumber(value)) {
        offset = toNumber(value) || 0;
    }
    else if (value === 'next') {
        offset = current + 1;
    }
    else if (value === 'previous') {
        offset = current - 1;
    }
    else {
        offset = childIndex(elements, value);
    }
    if (finite) {
        return clamp(offset, 0, length - 1);
    }
    offset %= length;
    return offset < 0 ? offset + length : offset;
}
