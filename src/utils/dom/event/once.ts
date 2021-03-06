import { on, OnOptions } from './on';

import type { EventTargetLike } from './toEventTargets';

export interface OnceOptions extends OnOptions {
  condition?: Function;
  selector?: string;
}

export function once(
  target: EventTargetLike | EventTargetLike[],
  type: string,
  listener: Function,
  { condition, ...options }: OnceOptions = {}
): Function {
  const off = on(
    target,
    type,
    (event: Event) => {
      if (!condition || condition(event)) {
        off();
        listener(event);
      }
    },
    options
  );

  return off;
}
