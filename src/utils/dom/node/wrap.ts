import { append, before, InsertValue } from './append';
import { notNullified } from '../../lang/misc/notNullified';
import { parent } from './parent';
import { removeNode } from './removeNode';
import { toNode, toNodes } from '../misc';

export function wrapAll(
  element: InsertValue,
  wrapper: InsertValue
): Node | null {
  let result = toNode(before(element, wrapper));
  if (!result) {
    return null;
  }

  while (result.firstChild) {
    result = result.firstChild;
  }

  append(result, element);
  return result;
}

export function wrapInner(
  element: tyny.ElementLike,
  structure: InsertValue
): Array<Node | null> {
  return toNodes(
    toNodes(element).map((element) =>
      element.hasChildNodes()
        ? wrapAll(toNodes(element.childNodes), structure)
        : (append(element, structure) as any)
    )
  );
}

export function unwrap(element: tyny.ElementLike): void {
  toNodes(element)
    .map(parent)
    .filter((value, index, self) => self.indexOf(value) === index)
    .filter(notNullified)
    .forEach((parent) => {
      before(parent, parent.childNodes);
      removeNode(parent);
    });
}
