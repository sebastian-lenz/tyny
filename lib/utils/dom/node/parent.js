import { toElement } from '../misc';
export function parent(value) {
    var element = toElement(value);
    return element ? element.parentElement : null;
}
