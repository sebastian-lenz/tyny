import { toElement } from '../misc';
export function parent(value) {
    const element = toElement(value);
    return element ? element.parentElement : null;
}
