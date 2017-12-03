import { $, View, ViewOptions } from 'tyny';

@$.component('.tynyViewsDataElement')
export default class DataElement extends View {
  @$.data({ type: 'element' })
  singleElement: HTMLElement;

  @$.data({ type: 'elements' })
  multipleElements: HTMLElement[];

  constructor(options: ViewOptions) {
    super(options);

    this.singleElement.innerHTML = 'Hello world!';
    this.multipleElements.forEach(
      (element, index) => (element.innerHTML = `Element #${index}`)
    );
  }
}
