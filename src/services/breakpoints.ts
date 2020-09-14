import { getWindowWidth } from '../utils/dom/window/getWindowWidth';
import { on } from '../utils/dom/event/on';
import { trigger } from '../utils/dom/event/trigger';

export const breakpointEvent = 'tyny:breakpoint';

export interface BreakpointEventArgs {
  breakpoint: Breakpoint;
  index: number;
}

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface Breakpoint {
  index: number;
  name: BreakpointName;
  width: number;
}

export const breakpoints: Breakpoint[] = [
  { index: 0, name: 'xs', width: 0 },
  { index: 1, name: 'sm', width: 576 },
  { index: 2, name: 'md', width: 768 },
  { index: 3, name: 'lg', width: 992 },
  { index: 4, name: 'xl', width: 1200 },
  { index: 5, name: 'xxl', width: 1400 },
];

let currentIndex: number = findCurrentIndex();

function findCurrentIndex(): number {
  const length = breakpoints.length;
  const width = getWindowWidth();

  for (let index = 1; index < length; index++) {
    if (breakpoints[index].width > width) {
      return index - 1;
    }
  }

  return length - 1;
}

function findNameIndex(name: BreakpointName): number {
  return breakpoints.findIndex((breakpoint) => breakpoint.name === name);
}

function onResize() {
  const index = findCurrentIndex();
  if (index === currentIndex) return;
  currentIndex = index;

  trigger(window, breakpointEvent, <BreakpointEventArgs>{
    breakpoint: breakpoints[index],
    index,
  });
}

export function getBreakpoint(): Breakpoint {
  return breakpoints[currentIndex];
}

export function isBreakpoint(name: BreakpointName): boolean {
  return getBreakpoint().name === name;
}

export function isAboveBreakpoint(name: BreakpointName): boolean {
  return findNameIndex(name) >= currentIndex;
}

export function isBelowBreakpoint(name: BreakpointName): boolean {
  return findNameIndex(name) <= currentIndex;
}

on(window, 'resize', onResize);
