import { basename, extname, join } from 'path';
import { readFileSync } from 'fs';
import handlebars from 'handlebars';

import walk from './utils/walk';

export default function handlebarsPartials(options = {}) {
  return function(files, metalsmith, done) {
    const path = metalsmith.path('./partials');

    walk(path, '*.hbs', function(fileName, subPath) {
      const raw = readFileSync(fileName, 'utf8');
      const id = join(subPath, basename(fileName, extname(fileName))).replace(
        /\\/g,
        '/'
      );

      handlebars.registerPartial(id, raw);
    });

    done();
  };
}
