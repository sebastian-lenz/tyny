import { createElement } from 'preact';
export function Route(props) {
    return createElement(props.component, props);
}
