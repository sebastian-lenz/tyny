import memoize from '../memoize';
import prefixed, { PrefixVendor } from './prefixed';

export interface TransitionProps {
  hasTransition: boolean;
  onTransitionEnd: string;
  transition: string;
  transitionDelay: string;
  transitionDuration: string;
  transitionProperty: string;
  transitionTimingFunction: string;
}

export default memoize(function transitionProps(): TransitionProps {
  return prefixed({
    events: ['transitionEnd'],
    filter: (props: TransitionProps, vendor?: PrefixVendor) => ({
      ...props,
      hasTransition: !!vendor,
    }),
    styles: [
      'transition',
      'transitionDelay',
      'transitionDuration',
      'transitionProperty',
      'transitionTimingFunction',
    ],
    vendors: [
      { prefix: 'Webkit', eventPrefix: 'webkit', eventCamelCase: true },
      { prefix: 'O', eventPrefix: 'o' },
    ],
  });
});
