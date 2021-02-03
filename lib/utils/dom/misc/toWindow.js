import { isDocument } from './isDocument';
import { isWindow } from './isWindow';
import { toNode } from './toNode';
export function toWindow(value) {
    if (isWindow(value)) {
        return value;
    }
    var node = toNode(value);
    if (!node)
        return window;
    var document = isDocument(node) ? node : node.ownerDocument;
    if (!document)
        return window;
    return document.defaultView || window;
}
