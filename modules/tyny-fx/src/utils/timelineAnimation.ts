import { Animation } from '../index';
import { PropertyMap } from './propertyMap';
import Timeline, { TimelineOptions } from '../timelines/Timeline';

import director from '../director';

export default function timelineAnimation<
  TProperty,
  TOptions,
  TTimeline extends Timeline,
  TExtraProps
>(
  context: any,
  properties: PropertyMap<TProperty>,
  options: TOptions,
  timelineClass: {
    new (options: TimelineOptions & TOptions & TProperty): TTimeline;
  },
  extraProps: (timelines: TTimeline[]) => TExtraProps
): Animation<any> & TExtraProps {
  const { addTimeline } = director();
  let children: TTimeline[] = [];

  const promise = new Promise((resolve, reject) => {
    const propertyNames = Object.keys(properties);
    let numFinished = 0;

    children = propertyNames.map(property => {
      const timeline = new timelineClass(
        Object.assign({ context, property }, options, properties[property])
      );

      timeline.onFinished = handleFinished;
      timeline.onStopped = handleStopped;
      director().addTimeline(timeline);
      return timeline;
    });

    function handleFinished() {
      numFinished += 1;
      if (numFinished === children.length) {
        resolve();
      }
    }

    function handleStopped() {
      reject();
    }
  }).then(() => {
    return children.reduce(
      (props, child) => {
        props[child.property] = child.getCurrentValue();
        return props;
      },
      {} as any
    );
  });

  return Object.assign(promise, extraProps(children), {
    stop: () => children.forEach(child => child.stop()),
  });
}
