export function isMouseEvent(event: Event): event is MouseEvent {
  return 'clientX' in event;
}
