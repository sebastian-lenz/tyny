import { findAll } from '../node/find';
import { notNullified } from '../../lang/misc/notNullified';
import { isString } from '../../lang/string/isString';
import { toNode } from '../misc/toNode';
import { toNodes } from '../misc/toNodes';
function isEventTarget(target) {
    return target && 'addEventListener' in target;
}
function toEventTarget(target) {
    return isEventTarget(target) ? target : toNode(target);
}
export function toEventTargets(target) {
    if (isEventTarget(target)) {
        return [target];
    }
    else if (Array.isArray(target)) {
        return target.map(toEventTarget).filter(notNullified);
    }
    else if (isString(target)) {
        return findAll(target);
    }
    return toNodes(target);
}
