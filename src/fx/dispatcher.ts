import { Timeline } from './timelines/Timeline';

const callbacks: Function[] = [];
const timelines: Timeline[] = [];
let isFrameRequested = false;

function getTimelineIndex(context: any, property: string): number {
  return timelines.findIndex(
    (timeline) => timeline.context === context && timeline.property === property
  );
}

function handleFrame(timeStep: number) {
  let index = 0;

  while (index < timelines.length) {
    const timeline = timelines[index];
    const result = timeline.update(timeStep);
    timeline.accessor.setValue(timeline.getCurrentValue());

    if (result) {
      index += 1;
    } else {
      timelines.splice(index, 1);
    }
  }

  for (let index = 0; index < callbacks.length; index++) {
    callbacks[index]();
  }

  callbacks.length = 0;

  if (timelines.length) {
    requestFrame();
  }
}

function requestFrame(now = Date.now()) {
  if (isFrameRequested) return;
  isFrameRequested = true;

  window.requestAnimationFrame(() => {
    isFrameRequested = false;
    handleFrame(Date.now() - now);
  });
}

export function addTimeline(timeline: Timeline) {
  stop(timeline.context, timeline.property);

  timelines.push(timeline);
  requestFrame();
}

export function getTimeline(
  context: any,
  property: string
): Timeline | undefined {
  const index = getTimelineIndex(context, property);
  return index === -1 ? undefined : timelines[index];
}

export function stop(context?: any, property?: string) {
  let index = 0;

  while (index < timelines.length) {
    const timeline = timelines[index];
    if (
      (!context || context === timeline.context) &&
      (!property || property === timeline.property)
    ) {
      timeline.stop();
      timelines.splice(index, 1);
    } else {
      index += 1;
    }
  }
}

export function setFrameCallback(callback: Function) {
  callbacks.push(callback);
  requestFrame();
}
