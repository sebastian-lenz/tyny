import { isDocument } from './isDocument';
import { isWindow } from './isWindow';
import { toNode } from './toNode';

export function toWindow(value: any): Window {
  if (isWindow(value)) {
    return value;
  }

  const node = toNode(value);
  if (!node) return window;

  const document = isDocument(node) ? node : node.ownerDocument;
  if (!document) return window;

  return document.defaultView || window;
}
