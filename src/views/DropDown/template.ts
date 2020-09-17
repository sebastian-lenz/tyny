import {
  createElement,
  CreateElementOptions,
} from '../../utils/dom/node/createElement';

export type Label<T> = (el: T) => string;

export interface Options<T extends HTMLElement = HTMLElement> {
  className: string;
  element: T;
  groupLabel: Label<HTMLOptGroupElement>;
  optionLabel: Label<HTMLOptionElement>;
}

const tag = (options: CreateElementOptions) => {
  return createElement(options).outerHTML;
};

const items = (options: Options): string =>
  Array.prototype.slice
    .apply(options.element.children)
    .map((child: HTMLElement) => {
      switch (child.nodeName.toLowerCase()) {
        case 'option':
          return option({ ...options, element: child as any });
        case 'optgroup':
          return optGroup({ ...options, element: child as any });
        default:
          return child.nodeName;
      }
    })
    .join('');

const optGroup = (options: Options<HTMLOptGroupElement>) => `
  <li class="${options.className}--listItem group">
    <div class="${options.className}--listGroup">${options.groupLabel(
  options.element
)}</div>
    <ul class="${options.className}--list">
      ${items(options)}
    </ul>
  </li>`;

const option = ({
  className,
  element,
  optionLabel,
}: Options<HTMLOptionElement>) =>
  tag({
    attributes: {
      'data-dropdown-value': element.value,
    },
    className: `${className}--listItem option`,
    tagName: 'li',
    template: optionLabel(element),
  });

export const template = (options: Options<HTMLSelectElement>) => `
  <ul class="${options.className}--list">
    ${items(options)}
  </ul>`;
