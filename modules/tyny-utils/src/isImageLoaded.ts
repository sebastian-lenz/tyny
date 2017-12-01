export default function isImageLoaded(image: HTMLImageElement): boolean {
  const src = image.getAttribute('src');
  if (src && !/^data:/.test(src)) {
    if (
      image.complete &&
      typeof image.naturalWidth !== 'undefined' &&
      image.naturalWidth != 0
    ) {
      return true;
    }
  }

  return false;
}
