import { $, PointerEvent, View, ViewOptions } from 'tyny';

@$.component('.tynyViewsEventsPointers')
export default class EventsResize extends View {
  circles: { [id: string]: HTMLElement } = {};

  @$.pointerEvent('add')
  handlePointerAdd(event: PointerEvent) {
    const { pointer } = event;
    const circle = document.createElement('div');
    circle.className = 'pointer';
    circle.style.top = `${pointer.clientY}px`;
    circle.style.left = `${pointer.clientX}px`;

    this.element.appendChild(circle);
    this.circles[pointer.id] = circle;
  }

  @$.pointerEvent('remove')
  handlePointerRemove(event: PointerEvent) {
    const { pointer } = event;
    const circle = this.circles[pointer.id];

    this.element.removeChild(circle);
    delete this.circles[pointer.id];
  }

  @$.pointerEvent('update')
  handlePointerUpdate(event: PointerEvent) {
    const { pointer } = event;
    const rect = this.element.getBoundingClientRect();
    const circle = this.circles[pointer.id];
    circle.style.top = `${pointer.clientY}px`;
    circle.style.left = `${pointer.clientX}px`;
  }
}
