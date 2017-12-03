import { basename, dirname, extname } from 'path';
import handlebars from 'handlebars';
import showdown from 'showdown';

const converter = new showdown.Converter();

export default function markdown(options) {
  options = options || {};
  var keys = options.keys || [];

  return function(files, metalsmith, done) {
    setImmediate(done);

    Object.keys(files).forEach(function(fileName) {
      const file = files[fileName];
      if (!/\.md|\.markdown/.test(extname(fileName))) {
        return;
      }

      const path = dirname(fileName);
      let targetName = `${basename(fileName, extname(fileName))}.html`;
      if (path !== '.') {
        targetName = `${path}/${targetName}`;
      }

      const template = handlebars.compile(file.contents.toString());
      file.contents = new Buffer(converter.makeHtml(template(file)));

      delete files[fileName];
      files[targetName] = file;
    });
  };
}
