import { $, View, ViewOptions } from 'tyny';

@$.component('.tynyViewsChildComponent')
export class ChildView extends View {
  constructor(options: ViewOptions) {
    super(options);
    this.element.innerHTML = 'I am a child component!';
  }
}

@$.component('.tynyViewsChildComponents', { allowChildComponents: true })
export default class ChildBasic extends View {}
