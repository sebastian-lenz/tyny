import { Breakpoint } from './index';

export default function defaultBreakpoints(): Breakpoint[] {
  return [
    {
      name: 'xs',
      minWidth: 0,
      containerWidth: 0,
      update: (breakpoint: Breakpoint, width: number) => {
        breakpoint.containerWidth = width - 30;
      },
    },
    {
      name: 'sm',
      minWidth: 768,
      containerWidth: 720,
    },
    {
      name: 'md',
      minWidth: 992,
      containerWidth: 940,
    },
    {
      name: 'lg',
      minWidth: 1200,
      containerWidth: 1140,
    },
  ];
}
