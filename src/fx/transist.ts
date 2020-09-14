import { EasingFunction } from './index';
import { onTransitionEnd, transition } from '../utils/env/transitionProps';
import { withoutTransition } from './withoutTransition';

export interface TransistOptions {
  delay: number;
  duration: number;
  timingFunction: string | EasingFunction;
}

export interface TransistProperty {
  clear?: boolean;
  duration?: number;
  delay?: number;
  from?: string;
  timingFunction?: string | EasingFunction;
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
  const defaults = transist.defaultOptions;
  const {
    delay: defaultDelay = defaults.delay,
    duration: defaultDuration = defaults.duration,
    timingFunction: defaultTimingFunction = defaults.timingFunction,
  } = options;

  const style = <any>element.style;
  const clearProps: string[] = ['transition'];
  const fromProps: [string, string][] = [];
  const toProps: [string, string][] = [];

  toProps.push([
    transition,
    Object.keys(properties)
      .map((key) => {
        const property = properties[key];
        let delay = defaultDelay;
        let duration = defaultDuration;
        let timingFunction = defaultTimingFunction;

        if (typeof property === 'string') {
          toProps.push([key, property]);
        } else {
          if (property.delay) delay = property.delay;
          if (property.duration) duration = property.duration;
          if (property.timingFunction) timingFunction = property.timingFunction;
          if (property.from) fromProps.push([key, property.from]);
          if (property.clear) clearProps.push(key);
          toProps.push([key, property.to]);
        }

        return `${key} ${duration}ms ${delay}ms ${
          typeof timingFunction === 'function'
            ? timingFunction.toCSS()
            : timingFunction
        }`;
      })
      .join(','),
  ]);

  return new Promise((resolve) => {
    let numProperties = toProps.length - 1;

    function handleEnd(event: Event | TransitionEvent) {
      if (event.target !== element) return;
      if ('propertyName' in event && --numProperties > 0) return;
      element.removeEventListener(onTransitionEnd, handleEnd);
      clearProps.forEach((key) => (style[key] = ''));
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
    duration: 400,
    timingFunction: 'ease-in-out',
  };
}

export { transist };
