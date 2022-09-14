import { jsx as _jsx } from "preact/jsx-runtime";
import cx from 'classnames';
import { Numeration as NumerationView } from '../../views/Numeration';
import { registerView } from '../../core';
registerView('Numeration', NumerationView);
export function Numeration({ className, target }) {
    return (_jsx("div", { class: cx(NumerationView.prototype.component.className, className), "data-target": target }));
}
