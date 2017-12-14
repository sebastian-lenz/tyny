import { viewport } from 'tyny-services/lib/viewport';
import transitionProps from 'tyny-utils/lib/vendors/transitionProps';

import transist, { TransistOptions, TransistPropertyMap } from './transist';
import withoutTransition from './withoutTransition';

export interface TransistDimensionsOptions extends Partial<TransistOptions> {
  transistHeight?: boolean;
  transistWidth?: boolean;
}

export default function transistDimensions(
  element: HTMLElement,
  callback: Function,
  options: TransistDimensionsOptions
): Promise<void> {
  const { hasTransition, transition } = transitionProps();
  if (!hasTransition) {
    callback();
    viewport().triggerResize();
    return Promise.resolve();
  }

  const { transistHeight, transistWidth } = options;
  const fromHeight = element.offsetHeight;
  const fromWidth = element.offsetWidth;
  const properties: TransistPropertyMap = {};
  const style = <any>element.style;

  withoutTransition(element, function() {
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

  if (!hasChanged) {
    return Promise.resolve();
  }

  return transist(element, properties, options);
}
