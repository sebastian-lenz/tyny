import { $ } from './$';
import { fragment } from './fragment';
import { isString } from '../../lang/string/isString';
import { toNodes } from '../misc';

function insertNodes(
  value: InsertValue,
  callback: (element: Node) => Node
): InsertResult {
  const node = isString(value) ? fragment(value) : value;
  if (!node) {
    return null;
  }

  return 'length' in node ? toNodes(node).map(callback) : callback(node);
}

export type InsertResult = Node | Node[] | null;

export type InsertValue = Node | Node[] | NodeList | string | undefined | null;

export function append(
  target: tyny.ElementQuery,
  value: InsertValue
): InsertResult {
  const parent = $(target);
  if (!parent) return null;

  return insertNodes(value, (node) => parent.appendChild(node));
}

export function after(
  target: tyny.ElementQuery,
  element: InsertValue
): InsertResult {
  const ref = $(target);
  if (!ref) {
    return null;
  }

  return insertNodes(element, (element) =>
    ref.nextSibling
      ? (before(ref.nextSibling, element) as any)
      : (append(ref.parentNode, element) as any)
  );
}

export function before(
  target: tyny.ElementQuery,
  value: InsertValue
): InsertResult {
  const ref = $(target);
  const parent = ref ? ref.parentNode : null;
  if (!ref || !parent) {
    return null;
  }

  return insertNodes(value, (node) => parent.insertBefore(node, ref));
}

export function prepend(
  target: tyny.ElementQuery,
  value: InsertValue
): InsertResult {
  const parent = $(target);
  if (!parent) {
    return null;
  }

  if (!parent.hasChildNodes()) {
    return append(parent, value);
  } else {
    return insertNodes(value, (node) =>
      parent.insertBefore(node, parent.firstChild)
    );
  }
}
