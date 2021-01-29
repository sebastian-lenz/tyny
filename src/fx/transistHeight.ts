import { transistDimensions } from './transistDimensions';
import { TransistOptions, TransistPropertyMap } from './transist';

export interface TransistHeightOptions extends Partial<TransistOptions> {
  extraProperties?: TransistPropertyMap;
}

export function transistHeight(
  element: HTMLElement | null | undefined,
  callback: Function,
  options: TransistHeightOptions = {}
): Promise<void> {
  return transistDimensions(element, callback, {
    transistHeight: true,
    ...options,
  });
}
