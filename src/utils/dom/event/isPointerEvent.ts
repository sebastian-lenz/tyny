export function isPointerEvent(event: Event): event is PointerEvent {
  return 'pointerType' in event;
}
