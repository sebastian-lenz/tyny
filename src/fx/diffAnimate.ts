import { animate, AnimateOptions } from './animate';
import { diff, DiffCallback, DiffResult, DiffState } from './diff';
import { noop } from '../utils/lang/function';
import { transistPositions, Options as PositionOptions } from './diffPositions';

function onlyVisible(items: Array<DiffState>): Array<DiffState> {
  return items.filter((item) => item.inViewport);
}

export interface Options extends PositionOptions {
  animateOptions?: AnimateOptions;
  fadeIn?: string;
  fadeOut?: string;
  detach?: boolean;
  origin?: HTMLElement;
}

export function transistChanges(
  diff: DiffResult,
  options: Options = {}
): Promise<void> {
  const {
    animateOptions,
    detach,
    fadeIn = 'fadeIn',
    fadeOut = 'fadeOut',
    origin,
  } = options;

  const created = onlyVisible(diff.created);
  const deleted = onlyVisible(diff.deleted);
  const originRect = origin ? origin.getBoundingClientRect() : null;
  const shiftTop = originRect ? -originRect.top : 0;
  const shiftLeft = originRect ? -originRect.left : 0;

  const animations = [
    ...created.map(({ element }) => animate(element, fadeIn, animateOptions)),
    ...deleted.map(({ element, position }) => {
      const { style } = element;
      style.position = 'absolute';
      style.top = `${position.top + shiftTop}px`;
      style.left = `${position.left + shiftLeft}px`;

      return animate(element, fadeOut, animateOptions).then(() => {
        if (detach) {
          element.remove();
        } else {
          style.position = '';
          style.top = '';
          style.left = '';
        }
      });
    }),
  ];

  return Promise.all(animations).then(noop);
}

export function diffAnimate(
  initialElements: HTMLElement[],
  callback: DiffCallback,
  options: Options & { finished?: VoidFunction } = {}
): DiffResult {
  const result = diff(initialElements, callback);
  const promise = Promise.all([
    transistPositions(result, options),
    transistChanges(result, options),
  ]);

  if (options.finished) {
    promise.then(options.finished);
  }

  return result;
}
