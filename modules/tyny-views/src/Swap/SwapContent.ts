import { SelectableView, View, ViewOptions } from 'tyny';

export interface SwapContentOptions extends ViewOptions {}

export default class SwapContent extends View implements SelectableView {
  isSelected: boolean = false;

  setSelected(value: boolean) {
    this.isSelected = value;
    this.toggleClass('selected', value);
  }
}
