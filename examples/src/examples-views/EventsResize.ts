import { $, View, ViewOptions } from 'tyny';

let counter: number = 0;

@$.component('.tynyViewsEventsResize')
export default class EventsResize extends View {
  @$.data({ type: 'element', tagName: 'div' })
  display: HTMLElement;

  child: EventsResize | undefined;

  constructor(options: ViewOptions) {
    super(options);
    if (!options.appendTo) {
      this.child = new EventsResize({ appendTo: this.element });
    }
  }

  @$.resizeEvent()
  handleResize() {
    this.display.innerHTML = `Resize event #${++counter}`;
  }
}
