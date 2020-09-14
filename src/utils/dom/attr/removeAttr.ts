import { toElements } from '../misc/toElements';

export function removeAttr(element: tyny.ElementLike, ...names: string[]) {
  toElements(element).forEach((element) => {
    names.forEach((name) => element.removeAttribute(name));
  });
}
