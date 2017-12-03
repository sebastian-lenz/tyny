export interface CreateElementOptions {
  appendTo?: HTMLElement;
  attributes?: { [name: string]: string };
  className?: string;
  tagName?: string;
}

export default function createElement(
  options: CreateElementOptions
): HTMLElement {
  const { appendTo, attributes, className, tagName = 'div' } = options;
  const element = document.createElement(tagName);

  if (appendTo) appendTo.appendChild(element);
  if (className) element.className = className;
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      element.setAttribute(key, attributes[key]);
    });
  }

  return element;
}
