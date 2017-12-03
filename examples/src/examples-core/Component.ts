import { $, View, ViewOptions } from 'tyny';

@$.component('.tynyCoreComponent')
export default class ViewsComponent extends View {
  constructor(options: ViewOptions) {
    super(options);
    this.element.innerHTML = 'My first component!';
  }
}
