import { viewport } from 'tyny-services';

/**
 * Describes the result of the [[diff]] function.
 */
export interface DiffResult {
  /**
   * A list of all elements that have been created.
   */
  created: DiffState[];

  /**
   * A list of all elements that have been deleted.
   */
  deleted: DiffState[];

  /**
   * A list of all elements that have changed.
   */
  changed: DiffChangedState[];
}

/**
 * Describes the state of a created or deleted element returned by [[diff]].
 */
export interface DiffState {
  /**
   * The related element.
   */
  element: HTMLElement;

  /**
   * The position of the element.
   */
  position: ClientRect;

  /**
   * Is the element within the visible viewport?
   */
  inViewport: boolean;
}

/**
 * Describes the state of a changed element returned by [[diff]].
 */
export interface DiffChangedState {
  /**
   * The related element.
   */
  element: HTMLElement;

  /**
   * The original position of the element.
   */
  from: ClientRect;

  /**
   * The new position of the element.
   */
  to: ClientRect;

  /**
   * Is or was the element within the visible viewport?
   */
  inViewport: boolean;
}

export interface DiffCallback {
  (): HTMLElement[];
}

/**
 * Calculate the difference between two lists of elements.
 *
 * @param initialElements  A list of all persistent elements.
 * @param callback  A callback that changes the visible elements and returns the new list.
 */
export function diff(
  initialElements: HTMLElement[],
  callback: DiffCallback
): DiffResult {
  const deleted: DiffState[] = [];
  const created: DiffState[] = [];
  const changed: DiffChangedState[] = [];
  const positions: Array<ClientRect | null> = initialElements.map(el =>
    el.getBoundingClientRect()
  );

  const min = 0;
  const max = viewport.height;
  const isInViewport = (top: number, bottom: number): boolean =>
    bottom > min && top < max;

  callback().forEach(element => {
    const position = element.getBoundingClientRect();
    const index = initialElements.indexOf(element);
    const inViewport = isInViewport(position.top, position.bottom);

    if (index == -1) {
      created.push({ element, position, inViewport });
    } else {
      const oldPosition = positions[index];
      positions[index] = null;
      if (!oldPosition) {
        return;
      }

      changed.push({
        element,
        from: oldPosition,
        to: position,
        inViewport:
          inViewport || isInViewport(oldPosition.top, oldPosition.bottom),
      });
    }
  });

  initialElements.forEach((element, index) => {
    const position = positions[index];
    if (position) {
      deleted.push({
        element,
        position,
        inViewport: isInViewport(position.top, position.bottom),
      });
    }
  });

  return {
    changed,
    created,
    deleted,
  };
}
