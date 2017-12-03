import assets from 'metalsmith-static';
import chokidar from 'chokidar';
import layouts from 'metalsmith-layouts';
import metalsmith from 'metalsmith';

import handlebarsHelpers from './plugins/handlebars-helpers';
import handlebarsPartials from './plugins/handlebars-partials';
import markdown from './plugins/markdown';
import structure from './plugins/structure';

const basePath = `${__dirname}/templates/`;
const generator = metalsmith(basePath)
  .metadata({
    siteName: 'TyNY',
  })
  .source('./pages')
  .destination('../public')
  .use(
    assets({
      src: 'assets',
      dest: './assets',
    })
  )
  .use(handlebarsHelpers())
  .use(handlebarsPartials())
  .use(markdown())
  .use(structure())
  .use(
    layouts({
      engine: 'handlebars',
      default: 'default.hbs',
    })
  );

export default {
  generate: () =>
    new Promise((resolve, reject) => {
      generator.clean(true).build(function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
  watch: () => {
    chokidar
      .watch(basePath, { ignoreInitial: true })
      .on('all', function(event, path) {
        generator.clean(false).build(function(err) {
          if (err) console.log(err);
        });
      });
  },
};
