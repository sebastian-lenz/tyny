import cx from 'classnames';

import { Numeration as NumerationView } from '../../views/Numeration';
import { registerView } from '../../core';

registerView('Numeration', NumerationView);

export interface Props {
  className?: string;
  target: string;
}

export function Numeration({className, target}: Props) {
  return (
    <div
      class={cx(NumerationView.prototype.component.className, className)} 
      data-target={target}
    />
  );
}