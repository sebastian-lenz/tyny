// Values replaced at bundle time, e.g. by webpack's DefinePlugin.
//
// Only for compiling this library: it is not part of `lib` or `typings`, so it
// can't conflict with the `process` global of `@types/node` in consuming projects.
declare const process: {
  env: {
    TYNY_PREFIX: string;
  };
};
