import { transistDimensions } from './transistDimensions';
import { TransistOptions, TransistPropertyMap } from './transist';

export interface TransistWidthOptions extends Partial<TransistOptions> {
  extraProperties?: TransistPropertyMap;
}

export function transistWidth(
  element: HTMLElement | null | undefined,
  callback: Function,
  options: TransistWidthOptions = {}
): Promise<void> {
  return transistDimensions(element, callback, {
    transistWidth: true,
    ...options,
  });
}
