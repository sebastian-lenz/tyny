import { $, View, ViewOptions } from 'tyny';

export class ChildView extends View {
  constructor(options: ViewOptions) {
    super(options);
    this.element.innerHTML = 'I am a child component!';
  }
}

@$.component('.tynyCoreChildDecorator')
export default class ChildBasic extends View {
  @$.child({ selector: '.childComponent', viewClass: ChildView })
  childComponent: ChildView;
}
