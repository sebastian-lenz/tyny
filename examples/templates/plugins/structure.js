import relative from './utils/relative';
import structure from '../structure.json';

function getBreadcrumbs(pages) {
  const active = pages.find(page => page.isActive);
  if (!active) return [];

  const result = active.children ? getBreadcrumbs(active.children) : [];

  result.unshift({
    title: active.title,
    navTitle: active.navTitle,
    url: active.url,
    isProduct: active.isProduct,
  });

  return result;
}

function getStructure(fileName, pages = structure) {
  const absoluteFileName = `/${fileName}`.replace(/\.md$/, '.html');
  return pages.map(page => {
    const { url, children } = page;
    const props = {};
    const isCurrent = url === absoluteFileName;
    let isActive = isCurrent;

    if (children) {
      const newChildren = getStructure(fileName, children);
      isActive = isActive || newChildren.some(child => child.isActive);
      props.children = newChildren;
    }

    props.navTitle = page.navTitle || page.title;
    props.isActive = isActive;
    props.isCurrent = isCurrent;
    props.url = relative(absoluteFileName, url);
    return Object.assign({}, page, props);
  });
}

export default function(options = {}) {
  return function(files, metalsmith, done) {
    const fileNames = Object.keys(files);

    fileNames.forEach(fileName => {
      const file = files[fileName];
      const structure = getStructure(fileName);
      const breadcrumbs = getBreadcrumbs(structure);

      file.basePath = relative(`/${fileName}`, '/');
      file.urlHome = `${file.basePath}index.html`;
      file.structure = structure;

      if (!('title' in file) && breadcrumbs.length) {
        file.title = breadcrumbs[breadcrumbs.length - 1].title;
      }
    });

    done();
  };
}
