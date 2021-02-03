import { addTimeline } from '../dispatcher';
export function timelineAnimation(context, properties, options, timelineClass, extraProps) {
    let children = [];
    const promise = new Promise((resolve, reject) => {
        const propertyNames = Object.keys(properties);
        let numFinished = 0;
        children = propertyNames.map((property) => {
            const timeline = new timelineClass(Object.assign({ context, property }, options, properties[property]));
            timeline.onFinished = handleFinished;
            timeline.onStopped = handleStopped;
            addTimeline(timeline);
            return timeline;
        });
        function handleFinished() {
            numFinished += 1;
            if (numFinished === children.length) {
                resolve();
            }
        }
        function handleStopped() {
            if (options.rejectOnStop) {
                reject();
            }
        }
    }).then(() => {
        return children.reduce((props, child) => {
            props[child.property] = child.getCurrentValue();
            return props;
        }, {});
    });
    return Object.assign(promise, extraProps(children), {
        stop: () => children.forEach((child) => child.stop()),
    });
}
