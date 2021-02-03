import { toElement, toElements } from '../misc';
import { filter } from './filter';
export function children(element, selector) {
    var scope = toElement(element);
    var children = scope ? toElements(scope.children) : [];
    return selector ? filter(children, selector) : children;
}
