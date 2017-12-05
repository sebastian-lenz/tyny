import { TransistOptions } from './transist';
import transistDimensions from './transistDimensions';

export default function transistWidth(
  element: HTMLElement,
  callback: Function,
  options: Partial<TransistOptions> = {}
): Promise<void> {
  return transistDimensions(element, callback, {
    transistWidth: true,
    ...options,
  });
}
