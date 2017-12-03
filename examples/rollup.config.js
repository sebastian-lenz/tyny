import autoprefixer from 'autoprefixer';
import bootstrap from 'bootstrap-styl';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import nodeResolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript';
import typescriptCompiler from 'typescript';
import serve from 'rollup-plugin-serve';
import stylus from 'stylus';
import uglify from 'rollup-plugin-uglify';

import templates from './templates/index.js';

const isWatching = process.argv.some(arg => arg === '-w' || arg === '--watch');

const stylusPreprocessor = (content, id) =>
  new Promise((resolve, reject) => {
    const renderer = stylus(content, {
      filename: id,
      sourcemap: { inline: true },
    }).use(bootstrap());
    renderer.render((err, code) => {
      if (err) {
        return reject(err);
      }
      resolve({ code, map: renderer.sourcemap });
    });
  });

const plugins = [
  commonjs({
    include: 'node_modules/**',
  }),
  nodeResolve({
    jsnext: true,
    main: true,
    module: true,
  }),
  postcss({
    preprocessor: stylusPreprocessor,
    plugins: [autoprefixer()],
    extract: true,
    extensions: ['.styl'],
  }),
  typescript({
    typescript: typescriptCompiler,
  }),
  ...(isWatching ? [livereload('public'), serve('public')] : [uglify()]),
];

export default templates.generate().then(() => {
  if (isWatching) {
    templates.watch();
  }

  return {
    plugins,
    context: 'window',
    input: 'src/index.ts',
    output: {
      format: 'iife',
      file: 'public/assets/tyny.js',
      name: 'tyny',
    },
    watch: {
      chokidar: true,
    },
  };
});
