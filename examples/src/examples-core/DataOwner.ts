import { $, View, ViewOptions } from 'tyny';

export class ChildView extends View {
  @$.data({ type: 'owner' })
  owner: DataOwner;

  constructor(options: ViewOptions) {
    super(options);
    this.element.innerHTML = this.owner.getGreeting();
  }
}

@$.component('.tynyCoreDataOwner')
export default class DataOwner extends View {
  @$.child({ selector: '.childComponent', viewClass: ChildView })
  childComponent: ChildView;

  getGreeting(): string {
    return 'Text from DataOwner component';
  }
}
