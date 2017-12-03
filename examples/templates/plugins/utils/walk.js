import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import multimatch from 'multimatch';

export default function walk(path, pattern, callback, subPath = '') {
  readdirSync(join(path, subPath)).forEach(fileName => {
    const localName = join(subPath, fileName);
    const globalName = join(path, localName);

    if (statSync(globalName).isDirectory()) {
      walk(path, pattern, callback, localName);
    } else if (multimatch(fileName, pattern).length) {
      callback(globalName, subPath);
    }
  });
}
