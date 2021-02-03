import { toElements } from './toElements';
import { matches } from '../node/matches';
export const selInput = 'input,select,textarea,button';
export function isInput(element) {
    return toElements(element).some((element) => matches(element, selInput));
}
