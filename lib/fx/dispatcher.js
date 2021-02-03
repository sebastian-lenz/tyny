var callbacks = [];
var timelines = [];
var isFrameRequested = false;
function getTimelineIndex(context, property) {
    return timelines.findIndex(function (timeline) { return timeline.context === context && timeline.property === property; });
}
function handleFrame(timeStep) {
    var index = 0;
    while (index < timelines.length) {
        var timeline = timelines[index];
        var result = timeline.update(timeStep);
        timeline.accessor.setValue(timeline.getCurrentValue());
        if (result) {
            index += 1;
        }
        else {
            timelines.splice(index, 1);
        }
    }
    for (var index_1 = 0; index_1 < callbacks.length; index_1++) {
        callbacks[index_1]();
    }
    callbacks.length = 0;
    if (timelines.length) {
        requestFrame();
    }
}
function requestFrame(now) {
    if (now === void 0) { now = Date.now(); }
    if (isFrameRequested)
        return;
    isFrameRequested = true;
    window.requestAnimationFrame(function () {
        isFrameRequested = false;
        handleFrame(Date.now() - now);
    });
}
export function addTimeline(timeline) {
    stop(timeline.context, timeline.property);
    timelines.push(timeline);
    requestFrame();
}
export function getTimeline(context, property) {
    var index = getTimelineIndex(context, property);
    return index === -1 ? undefined : timelines[index];
}
export function stop(context, property) {
    var index = 0;
    while (index < timelines.length) {
        var timeline = timelines[index];
        if ((!context || context === timeline.context) &&
            (!property || property === timeline.property)) {
            timeline.stop();
            timelines.splice(index, 1);
        }
        else {
            index += 1;
        }
    }
}
export function setFrameCallback(callback) {
    callbacks.push(callback);
    requestFrame();
}
