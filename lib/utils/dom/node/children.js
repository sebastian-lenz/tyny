import { toElement, toElements } from '../misc';
import { filter } from './filter';
export function children(element, selector) {
    const scope = toElement(element);
    const children = scope ? toElements(scope.children) : [];
    return selector ? filter(children, selector) : children;
}
