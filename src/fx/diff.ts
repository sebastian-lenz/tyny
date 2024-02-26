import { getWindowWidth } from '../utils/dom/window/getWindowWidth';

export interface DiffResult {
  changed: DiffChangedState[];
  created: DiffState[];
  deleted: DiffState[];
}

export interface DiffState {
  element: HTMLElement;
  inViewport: boolean;
  position: DOMRect;
}

export interface DiffChangedState {
  element: HTMLElement;
  from: DOMRect;
  inViewport: boolean;
  to: DOMRect;
}

export type DiffInitialState = Array<{
  element: HTMLElement;
  position: DOMRect;
}>;

export type DiffCallback = () => Array<HTMLElement>;

function createDiff(): DiffResult {
  return {
    changed: [],
    created: [],
    deleted: [],
  };
}

export function createDiffState(
  elements: Array<HTMLElement>
): DiffInitialState {
  return elements.map((element) => ({
    element,
    position: element.getBoundingClientRect(),
  }));
}

function inViewportFactory() {
  const min = 0;
  const max = getWindowWidth();
  return (rect: DOMRect): boolean => rect.bottom > min && rect.top < max;
}

export function diff(
  elements: Array<HTMLElement>,
  callback: DiffCallback
): DiffResult {
  return diffFromState(createDiffState(elements), callback());
}

export function diffFromState(
  state: DiffInitialState,
  elements: Array<HTMLElement>
) {
  const isInViewport = inViewportFactory();
  const result = createDiff();

  for (const element of elements) {
    const position = element.getBoundingClientRect();
    const index = state.findIndex((state) => state.element === element);
    const inViewport = isInViewport(position);

    if (index === -1) {
      result.created.push({ element, position, inViewport });
    } else {
      const from = state[index].position;
      state.splice(index, 1);

      result.changed.push({
        element,
        from: from,
        to: position,
        inViewport: inViewport || isInViewport(from),
      });
    }
  }

  for (const deleted of state) {
    result.deleted.push({
      ...deleted,
      inViewport: isInViewport(deleted.position),
    });
  }

  return result;
}
