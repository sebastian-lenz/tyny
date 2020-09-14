import { getStyles } from './getStyles';

export function getStyle(
  element: tyny.ElementLike,
  property: string,
  pseudoElt?: string | null
): string | null {
  const styles = getStyles(element, pseudoElt);
  return styles && property in styles ? styles[property as any] : null;
}
