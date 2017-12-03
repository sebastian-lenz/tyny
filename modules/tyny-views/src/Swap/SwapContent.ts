import { SelectableView, View, ViewOptions } from 'tyny';

export default class SwapContent extends View implements SelectableView {
  isSelected: boolean = false;

  setSelected(value: boolean) {
    this.isSelected = value;
    this.toggleClass('selected', value);
  }
}
