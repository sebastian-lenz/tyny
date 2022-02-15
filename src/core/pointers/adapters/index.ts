import { MouseAdapter } from './MouseAdapter';
import { PointerAdapter } from './PointerAdapter';
import { PointerBehaviour } from '../PointerBehaviour';
import { TouchAdapter } from './TouchAdapter';

import type { AbstractAdapter } from './AbstractAdapter';

export function createAdapter(
  element: HTMLElement,
  pointerList: PointerBehaviour
): AbstractAdapter {
  if (TouchAdapter.isSupported()) {
    return new TouchAdapter(element, pointerList);
  } else if (PointerAdapter.isSupported()) {
    return new PointerAdapter(element, pointerList);
  }

  return new MouseAdapter(element, pointerList);
}
