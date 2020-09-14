import { matches } from './matches';
import { toElements } from '../misc/toElements';

export function filter(
  element: tyny.ElementLike,
  selector: string
): HTMLElement[] {
  return toElements(element).filter((element) => matches(element, selector));
}
