import { toElements } from './toElements';
import { matches } from '../node/matches';
export var selInput = 'input,select,textarea,button';
export function isInput(element) {
    return toElements(element).some(function (element) { return matches(element, selInput); });
}
