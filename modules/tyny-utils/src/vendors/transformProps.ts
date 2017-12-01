import memoize from '../memoize';
import prefixed, { PrefixVendor } from './prefixed';

export interface TransformProps {
  hasTransform: boolean;
  hasTransform3D: boolean;
  perspective: string;
  transform: string;
  transformOrigin: string;
}

export default memoize(function transformProps(): TransformProps {
  return prefixed({
    events: [],
    filter: (props: TransformProps, vendor?: PrefixVendor) => {
      let hasTransform3D;
      if (vendor) {
        const element = document.createElement('div');
        const { perspective } = props;
        hasTransform3D = (<any>element.style)[perspective] !== undefined;
      }

      if (!hasTransform3D) props.perspective = '';
      props.hasTransform = !!vendor;
      props.hasTransform3D = !!hasTransform3D;

      return props;
    },
    styles: ['perspective', 'transform', 'transformOrigin'],
    vendors: [
      { prefix: 'Webkit' },
      { prefix: 'moz' },
      { prefix: 'ms' },
      { prefix: 'O' },
    ],
  });
});
