import memoize from '../memoize';
import prefixed, { PrefixVendor } from './prefixed';

export interface AnimationProps {
  animation: string;
  animationDelay: string;
  animationDuration: string;
  animationFillMode: string;
  animationName: string;
  animationTimingFunction: string;
  hasAnimation: boolean;
  keyframePrefix: string;
  onAnimationEnd: string;
  onAnimationIteration: string;
  onAnimationStart: string;
}

export default memoize(function animationProps(): AnimationProps {
  return prefixed({
    events: ['animationEnd', 'animationIteration', 'animationStart'],
    filter: (props: AnimationProps, vendor?: PrefixVendor) => ({
      ...props,
      hasAnimation: !!vendor,
      keyframePrefix:
        vendor && vendor.prefix ? `-${vendor.prefix.toLowerCase()}-` : '',
    }),
    styles: [
      'animation',
      'animationDelay',
      'animationDuration',
      'animationFillMode',
      'animationName',
      'animationTimingFunction',
    ],
    vendors: [
      { prefix: 'Webkit', eventPrefix: 'webkit', eventCamelCase: true },
      { prefix: 'Moz' },
      { prefix: 'O', eventPrefix: 'o' },
    ],
  });
});
