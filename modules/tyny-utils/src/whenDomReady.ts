export default new Promise(resolve => {
  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', resolve);
  } else {
    (<any>window).attachEvent('onload', resolve);
  }
});
