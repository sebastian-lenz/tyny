import { TransistOptions } from './transist';
import transistDimensions from './transistDimensions';

export default function transistHeight(
  element: HTMLElement,
  callback: Function,
  options: Partial<TransistOptions> = {}
): Promise<void> {
  return transistDimensions(element, callback, {
    transistHeight: true,
    ...options,
  });
}
