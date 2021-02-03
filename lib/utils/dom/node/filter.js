import { matches } from './matches';
import { toElements } from '../misc/toElements';
export function filter(element, selector) {
    return toElements(element).filter((element) => matches(element, selector));
}
