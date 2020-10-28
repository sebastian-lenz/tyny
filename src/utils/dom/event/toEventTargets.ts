import { findAll } from '../node/find';
import { notNullified } from '../../lang/misc/notNullified';
import { isString } from '../../lang/string/isString';
import { toNode } from '../misc/toNode';
import { toNodes } from '../misc/toNodes';

function isEventTarget(target: any): target is EventTarget {
  return target && 'addEventListener' in target;
}

function toEventTarget(target: any): EventTarget | null {
  return isEventTarget(target) ? target : toNode(target);
}

export type EventTargetLike =
  | EventTarget
  | HTMLCollection
  | Node
  | NodeList
  | undefined
  | null
  | string;

export function toEventTargets(
  target: EventTargetLike | Array<EventTargetLike>
): Array<EventTarget> {
  if (isEventTarget(target)) {
    return [target];
  } else if (Array.isArray(target)) {
    return target.map(toEventTarget).filter(notNullified);
  } else if (isString(target)) {
    return findAll(target);
  }

  return toNodes(target);
}
