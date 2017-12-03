import { $, View, ViewOptions } from 'tyny';

@$.component('.tynyCoreEventsDelegate')
export default class EventsDelegate extends View {
  @$.data({ type: 'element', defaultValue: '.display' })
  display: HTMLElement;

  counter: number = 0;

  @$.delegate('click', { selector: 'button' })
  handleButtonClick() {
    this.display.innerHTML = `${++this.counter}`;
  }
}
