export function isTrackpad(event) {
    if ('wheelDeltaY' in event) {
        if (event['wheelDeltaY'] === event.deltaY * -3) {
            return true;
        }
    }
    else if (event.deltaMode === 0) {
        return true;
    }
    return false;
}
