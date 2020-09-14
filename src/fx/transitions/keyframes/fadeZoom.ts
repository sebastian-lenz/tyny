import { keyframes } from '../../keyframes';

export interface ZoomOptions {
  fromOpacity: number;
  fromScale: number;
  toOpacity: number;
  toScale: number;
}

function str(value: number): string {
  return value.toString().replace('.', '_');
}

export function fadeZoom({
  fromOpacity,
  fromScale,
  toOpacity,
  toScale,
}: ZoomOptions): string {
  const name = [
    'tynyFadeZoomKeyframes',
    str(fromOpacity),
    str(fromScale),
    str(toOpacity),
    str(toScale),
  ].join('-');

  return keyframes(name, {
    from: {
      opacity: `${fromOpacity}`,
      transform: `scale(${fromScale})`,
    },
    to: {
      opacity: `${toOpacity}`,
      transform: `scale(${toScale})`,
    },
  });
}
