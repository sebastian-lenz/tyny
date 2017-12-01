export default function isHtmlElement(value: any): value is HTMLElement {
  return !!(value && value.nodeType === 1);
}
