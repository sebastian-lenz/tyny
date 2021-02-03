import { isBoolean } from './isBoolean';
export function toBoolean(value) {
    if (isBoolean(value)) {
        return value;
    }
    else if (value === 'true' || value === '1' || value === '') {
        return true;
    }
    else if (value === 'false' || value === '0') {
        return false;
    }
    return !!value;
}
