import { toElement } from '../misc/toElement';
export function getStyles(target, pseudoElt) {
    var _a;
    var element = toElement(target);
    var view = (_a = element === null || element === void 0 ? void 0 : element.ownerDocument) === null || _a === void 0 ? void 0 : _a.defaultView;
    return element && view ? view.getComputedStyle(element, pseudoElt) : null;
}
