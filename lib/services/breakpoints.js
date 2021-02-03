import { getWindowWidth } from '../utils/dom/window/getWindowWidth';
import { on } from '../utils/dom/event/on';
import { trigger } from '../utils/dom/event/trigger';
export var breakpointEvent = 'tyny:breakpoint';
export var breakpoints = [
    { index: 0, name: 'xs', width: 0 },
    { index: 1, name: 'sm', width: 576 },
    { index: 2, name: 'md', width: 768 },
    { index: 3, name: 'lg', width: 992 },
    { index: 4, name: 'xl', width: 1200 },
    { index: 5, name: 'xxl', width: 1400 },
];
var currentIndex = findCurrentIndex();
function findCurrentIndex() {
    var length = breakpoints.length;
    var width = getWindowWidth();
    for (var index = 1; index < length; index++) {
        if (breakpoints[index].width > width) {
            return index - 1;
        }
    }
    return length - 1;
}
function findNameIndex(name) {
    return breakpoints.findIndex(function (breakpoint) { return breakpoint.name === name; });
}
function onResize() {
    var index = findCurrentIndex();
    if (index === currentIndex)
        return;
    currentIndex = index;
    trigger(window, breakpointEvent, {
        breakpoint: breakpoints[index],
        index: index,
    });
}
export function getBreakpoint() {
    return breakpoints[currentIndex];
}
export function isBreakpoint(name) {
    return getBreakpoint().name === name;
}
export function isAboveBreakpoint(name) {
    return findNameIndex(name) < currentIndex;
}
export function isBelowBreakpoint(name) {
    return findNameIndex(name) > currentIndex;
}
on(window, 'resize', onResize);
