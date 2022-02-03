import { JSX, RefObject } from 'preact';

export type TransitionElement = HTMLElement;

export interface Transition {
  begin: (callback: Function) => void;
  childRef: RefObject<TransitionElement> | null;
  lastChildRef: RefObject<TransitionElement> | null;
}

export interface TransitionEffect {
  (
    from: TransitionElement | null,
    to: TransitionElement | null,
    options: TransitionOptions
  ): Promise<any>;
}

export interface TransitionOptions {
  child: JSX.Element | null;
  childRef: RefObject<HTMLElement> | null;
  lastChild: JSX.Element | null;
  lastChildRef: RefObject<HTMLElement> | null;
  effect: TransitionEffect;
  rootRef: RefObject<HTMLElement>;
}

export function createTransition(options: TransitionOptions): Transition {
  const { childRef, effect, lastChildRef } = options;
  let didBegin = false;

  return {
    childRef,
    lastChildRef,
    begin: (callback: Function) => {
      if (didBegin) return;
      didBegin = true;

      function checkRefs() {
        let valid = true;
        if (childRef && !childRef.current) valid = false;
        if (lastChildRef && !lastChildRef.current) valid = false;
        if (!valid) {
          window.requestAnimationFrame(checkRefs);
        } else {
          effect(
            lastChildRef ? lastChildRef.current : null,
            childRef ? childRef.current : null,
            options
          ).then(() => callback());
        }
      }

      checkRefs();
    },
  };
}
