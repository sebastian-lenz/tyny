import { toElements } from './toElements';

const voidElements: { [name: string]: true } = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  menuitem: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
};

export function isVoidElement(element: tyny.ElementLike): boolean {
  return toElements(element).some(
    (element) => voidElements[element.tagName.toLowerCase()]
  );
}
