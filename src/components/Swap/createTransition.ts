import { RefObject } from 'preact';

export type TransitionElement = HTMLElement;

export interface Transition {
  begin: (callback: Function) => void;
  childRef: RefObject<TransitionElement> | null;
  lastChildRef: RefObject<TransitionElement> | null;
}

export interface TransitionEffect {
  (from: TransitionElement | null, to: TransitionElement | null): Promise<any>;
}

export interface TransitionOptions {
  childRef: RefObject<HTMLElement> | null;
  lastChildRef: RefObject<HTMLElement> | null;
  effect: TransitionEffect;
}

export default function createTransition({
  childRef,
  effect,
  lastChildRef,
}: TransitionOptions): Transition {
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
            childRef ? childRef.current : null
          ).then(() => callback());
        }
      }

      checkRefs();
    },
  };
}
