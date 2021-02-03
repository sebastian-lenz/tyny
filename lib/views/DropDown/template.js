import { createElement, } from '../../utils/dom/node/createElement';
const tag = (options) => {
    return createElement(options).outerHTML;
};
const items = (options) => Array.prototype.slice
    .apply(options.element.children)
    .map((child) => {
    switch (child.nodeName.toLowerCase()) {
        case 'option':
            return option(Object.assign(Object.assign({}, options), { element: child }));
        case 'optgroup':
            return optGroup(Object.assign(Object.assign({}, options), { element: child }));
        default:
            return child.nodeName;
    }
})
    .join('');
const optGroup = (options) => `
  <li class="${options.className}--listItem group">
    <div class="${options.className}--listGroup">${options.groupLabel(options.element)}</div>
    <ul class="${options.className}--list">
      ${items(options)}
    </ul>
  </li>`;
const option = ({ className, element, optionLabel, }) => tag({
    attributes: {
        'data-dropdown-value': element.value,
    },
    className: `${className}--listItem option`,
    tagName: 'li',
    template: optionLabel(element),
});
export const template = (options) => `
  <ul class="${options.className}--list">
    ${items(options)}
  </ul>`;
