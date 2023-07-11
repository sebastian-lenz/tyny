import { JSX, RefObject, VNode } from 'preact';

export type TransitionElement = HTMLElement | VNode;

export interface Transition {
  begin: (callback: Function) => void;
  childRef: RefObject<TransitionElement> | null;
  lastChildRef: RefObject<TransitionElement> | null;
}

export interface TransitionEffect {
  (
    from: HTMLElement | null,
    to: HTMLElement | null,
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

export function toElement(value: TransitionElement | null): HTMLElement | null {
  if (!value || value instanceof HTMLElement) {
    return value;
  }

  return (value as any).base;
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
            lastChildRef ? toElement(lastChildRef.current) : null,
            childRef ? toElement(childRef.current) : null,
            options
          ).then(() => callback());
        }
      }

      checkRefs();
    },
  };
}
