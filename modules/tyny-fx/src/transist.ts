import { transitionProps } from 'tyny-utils';

import withoutTransition from './withoutTransition';

export interface TransistOptions {
  delay: number;
  duration: number;
  timingFunction: string;
}

export interface TransistProperty {
  clear?: boolean;
  from?: string;
  to: string;
}

export interface TransistPropertyMap {
  [name: string]: string | TransistProperty;
}

function transist(
  element: HTMLElement,
  properties: TransistPropertyMap,
  options: Partial<TransistOptions> = {}
): Promise<void> {
  const { hasTransition, transition, onTransitionEnd } = transitionProps();
  if (!hasTransition) {
    return Promise.resolve();
  }

  const defaults = transist.defaultOptions;
  const {
    duration = defaults.duration,
    timingFunction = defaults.timingFunction,
    delay = defaults.delay,
  } = options;

  const style = <any>element.style;
  const clearProps: string[] = ['transition'];
  const fromProps: [string, string][] = [];
  const toProps: [string, string][] = [];

  toProps.push([
    transition,
    Object.keys(properties).reduce((memo, key) => {
      const property = properties[key];
      if (typeof property === 'string') {
        toProps.push([key, property]);
      } else {
        const { clear, from, to } = property;
        if (from) fromProps.push([key, from]);
        if (clear) clearProps.push(key);
        toProps.push([key, to]);
      }

      return `${memo}${key} ${duration}ms ${delay}ms ${timingFunction}`;
    }, ''),
  ]);

  return new Promise(resolve => {
    function handleEnd(event: Event) {
      if (event.target !== element) return;
      element.removeEventListener(onTransitionEnd, handleEnd);
      clearProps.forEach(key => (style[key] = ''));
      resolve();
    }

    if (fromProps.length) {
      withoutTransition(element, () => {
        fromProps.forEach(([key, value]) => (style[key] = value));
      });
    }

    element.addEventListener(onTransitionEnd, handleEnd);
    toProps.forEach(([key, value]) => (style[key] = value));
  });
}

namespace transist {
  export const defaultOptions: TransistOptions = {
    delay: 0,
    duration: 500,
    timingFunction: 'ease-in-out',
  };
}

export default transist;
