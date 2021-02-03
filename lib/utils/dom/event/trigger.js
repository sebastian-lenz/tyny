import { createEvent } from './createEvent';
import { toEventTargets } from './toEventTargets';
export function trigger(targets, event, detail) {
    return toEventTargets(targets).reduce((notCanceled, target) => notCanceled &&
        target.dispatchEvent(createEvent(event, true, true, detail)), true);
}
