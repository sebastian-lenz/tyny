import { hasOwn } from './hasOwn';

export const assign =
  Object.assign ||
  function (target: any, ...args: Array<any>): any {
    target = Object(target);
    for (let i = 0; i < args.length; i++) {
      const source = args[i];
      if (source !== null) {
        for (const key in source) {
          if (hasOwn(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
