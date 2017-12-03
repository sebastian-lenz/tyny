import { $, View, ViewOptions } from 'tyny';

@$.component('.tynyCoreChildComponent')
export class ChildView extends View {
  constructor(options: ViewOptions) {
    super(options);
    this.element.innerHTML = 'I am a child component!';
  }
}

@$.component('.tynyCoreChildComponents', { allowChildComponents: true })
export default class ChildBasic extends View {}
