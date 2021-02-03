import { Transition } from './index';

import animate from '../animate';
import fadeZoom from './keyframes/fadeZoom';

export interface ZoomOptions {
  duration?: number;
  delay?: number;
  timingFunction?: string;
  zoom: number;
  zoomFrom?: boolean;
  zoomTo?: boolean;
}

export default function zoom(options: ZoomOptions = { zoom: 0.5 }): Transition {
  const { zoom, zoomFrom = true, zoomTo = true, ...animationOptions } = options;

  const keyframesOut = fadeZoom({
    fromOpacity: 1,
    fromScale: 1,
    toOpacity: 0,
    toScale: zoomFrom ? 1 - zoom : 1,
  });

  const keyframesIn = fadeZoom({
    fromOpacity: 0,
    fromScale: zoomTo ? 1 + zoom : 1,
    toOpacity: 1,
    toScale: 1,
  });

  return (from?: HTMLElement, to?: HTMLElement): Promise<void> => {
    const animations = [];
    if (from) {
      animations.push(animate(from, keyframesOut, animationOptions));
    }

    if (to) {
      animations.push(animate(to, keyframesIn, animationOptions));
    }

    return animations.length
      ? Promise.all(animations).then(() => undefined)
      : Promise.resolve();
  };
}
