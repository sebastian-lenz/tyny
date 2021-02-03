import { addTimeline } from '../dispatcher';
export function timelineAnimation(context, properties, options, timelineClass, extraProps) {
    var children = [];
    var promise = new Promise(function (resolve, reject) {
        var propertyNames = Object.keys(properties);
        var numFinished = 0;
        children = propertyNames.map(function (property) {
            var timeline = new timelineClass(Object.assign({ context: context, property: property }, options, properties[property]));
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
    }).then(function () {
        return children.reduce(function (props, child) {
            props[child.property] = child.getCurrentValue();
            return props;
        }, {});
    });
    return Object.assign(promise, extraProps(children), {
        stop: function () { return children.forEach(function (child) { return child.stop(); }); },
    });
}
