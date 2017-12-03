import { dispatcher, DispatcherEvent } from 'tyny-services/lib/dispatcher';

import Timeline, { TimelineOptions } from '../timelines/Timeline';

export default class Director {
  protected callbacks: Function[] = [];
  protected timelines: Timeline[] = [];

  constructor() {
    dispatcher().on(DispatcherEvent.frameEvent, this.handleFrame, this, -10);
  }

  getTimeline(context: any, property: string): Timeline | undefined {
    const { timelines } = this;
    const index = this.getTimelineIndex(context, property);

    return index === -1 ? undefined : timelines[index];
  }

  setFrameCallback(callback: Function) {
    this.callbacks.push(callback);
  }

  addTimeline(timeline: Timeline) {
    this.removeTimeline(timeline.context, timeline.property);
    this.timelines.push(timeline);
  }

  removeTimeline(context?: any, property?: string) {
    const { timelines } = this;
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

  protected getTimelineIndex(context: any, property: string): number {
    const { timelines } = this;
    return timelines.findIndex(
      timeline => timeline.context === context && timeline.property === property
    );
  }

  protected handleFrame({ timeStep }: DispatcherEvent) {
    const { callbacks, timelines } = this;
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
  }
}
