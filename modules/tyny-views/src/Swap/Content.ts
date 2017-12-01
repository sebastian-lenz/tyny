import { SelectableView } from 'tyny/lib/utils/isSelectableView';
import View, { ViewOptions } from 'tyny/lib/View';

export default class Content<
  TOptions extends ViewOptions = ViewOptions
> extends View<TOptions> implements SelectableView {
  isSelected: boolean = false;

  setSelected(value: boolean) {
    this.isSelected = value;
    this.toggleClass('selected', value);
  }
}
