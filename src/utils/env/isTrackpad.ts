export function isTrackpad(event: WheelEvent): boolean {
  if ('wheelDeltaY' in event) {
    if ((event as any)['wheelDeltaY'] === event.deltaY * -3) {
      return true;
    }
  } else if (event.deltaMode === 0) {
    return true;
  }

  return false;
}
