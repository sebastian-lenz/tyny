import { createEvent } from './createEvent';
import { toEventTargets } from './toEventTargets';

export function trigger(
  targets: any,
  event: string | Event,
  detail?: any
): boolean {
  return toEventTargets(targets).reduce<boolean>(
    (notCanceled, target) =>
      notCanceled &&
      target.dispatchEvent(createEvent(event, true, true, detail)),
    true
  );
}
