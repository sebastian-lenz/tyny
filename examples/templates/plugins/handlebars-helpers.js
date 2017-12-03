import { basename, extname } from 'path';
import handlebars from 'handlebars';

import walk from './utils/walk';

export default function handlebarsHelpers(options = {}) {
  return function(files, metalsmith, done) {
    const path = metalsmith.path('./helpers');

    walk(path, '*.js', function(fileName) {
      const helper = require(fileName);
      const id = basename(fileName, extname(fileName));
      handlebars.registerHelper(id, helper);
    });

    done();
  };
}
