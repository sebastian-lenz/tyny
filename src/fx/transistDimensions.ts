import { transist, TransistOptions, TransistPropertyMap } from './transist';
import { transition } from '../utils/env/transitionProps';
import { withoutTransition } from './withoutTransition';

export interface TransistDimensionsOptions extends Partial<TransistOptions> {
  extraProperties?: TransistPropertyMap;
  transistHeight?: boolean;
  transistWidth?: boolean;
}

export function transistDimensions(
  element: HTMLElement,
  callback: Function,
  options: TransistDimensionsOptions
): Promise<void> {
  const { extraProperties, transistHeight, transistWidth } = options;
  const fromHeight = element.offsetHeight;
  const fromWidth = element.offsetWidth;
  const style = <any>element.style;
  const properties: TransistPropertyMap = extraProperties
    ? { ...extraProperties }
    : {};

  withoutTransition(element, function () {
    style.height = '';
    style.width = '';
    style[transition] = 'none';
    callback();
  });

  const toHeight = element.clientHeight;
  const toWidth = element.clientWidth;
  let hasChanged = false;

  if (transistHeight && fromHeight !== toHeight) {
    hasChanged = true;
    properties.height = {
      clear: true,
      from: `${fromHeight}px`,
      to: `${toHeight}px`,
    };
  }

  if (transistWidth && fromWidth !== toWidth) {
    hasChanged = true;
    properties.width = {
      clear: true,
      from: `${fromWidth}px`,
      to: `${toWidth}px`,
    };
  }

  if (!hasChanged && !extraProperties) {
    return Promise.resolve();
  }

  return transist(element, properties, options);
}
