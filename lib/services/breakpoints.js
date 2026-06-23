import { getWindowWidth } from '../utils/dom/window/getWindowWidth';
import { on } from '../utils/dom/event/on';
import { trigger } from '../utils/dom/event/trigger';
export const breakpointEvent = 'tyny:breakpoint';
export const breakpoints = [
    { index: 0, name: 'xs', width: 0 },
    { index: 1, name: 'sm', width: 576 },
    { index: 2, name: 'md', width: 768 },
    { index: 3, name: 'lg', width: 992 },
    { index: 4, name: 'xl', width: 1200 },
    { index: 5, name: 'xxl', width: 1400 },
];
let currentIndex = -1;
function findCurrentIndex() {
    const length = breakpoints.length;
    const width = getWindowWidth();
    for (let index = 1; index < length; index++) {
        if (breakpoints[index].width > width) {
            return index - 1;
        }
    }
    return length - 1;
}
function findNameIndex(name) {
    return breakpoints.findIndex((breakpoint) => breakpoint.name === name);
}
function onResize() {
    const index = findCurrentIndex();
    if (currentIndex === -1)
        currentIndex = index;
    if (currentIndex === index)
        return;
    currentIndex = index;
    trigger(window, breakpointEvent, {
        breakpoint: breakpoints[index],
        index,
    });
}
function getCurrentIndex() {
    if (currentIndex === -1) {
        currentIndex = findCurrentIndex();
    }
    return currentIndex;
}
export function getBreakpoint() {
    return breakpoints[getCurrentIndex()];
}
export function isBreakpoint(name) {
    return getBreakpoint().name === name;
}
export function isAboveBreakpoint(name) {
    return findNameIndex(name) < getCurrentIndex();
}
export function isBelowBreakpoint(name) {
    return findNameIndex(name) > getCurrentIndex();
}
if (typeof window !== 'undefined') {
    on(window, 'resize', onResize);
}
