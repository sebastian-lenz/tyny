import { toElements } from './toElements';

export function isVisible(element: tyny.ElementLike): boolean {
  return toElements(element).some(
    (element: any) =>
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
  );
}
