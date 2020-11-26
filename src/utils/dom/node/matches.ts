import { noop } from '../../lang/function/noop';
import { toElements } from '../misc';

const elProto: any = Element ? Element.prototype : {};

const matchesFn =
  elProto.matches ||
  elProto.webkitMatchesSelector ||
  elProto.msMatchesSelector ||
  noop;

export function matches(element: tyny.ElementLike, selector: string): boolean {
  return toElements(element).some((element) =>
    matchesFn.call(element, selector)
  );
}
