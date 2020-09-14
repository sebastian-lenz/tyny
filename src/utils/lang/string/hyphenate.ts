const cache: tyny.Map<string> = {};
const regExp = /([a-z\d])([A-Z])/g;

export function hyphenate(value: string): string {
  if (!(value in cache)) {
    cache[value] = value.replace(regExp, '$1-$2').toLowerCase();
  }

  return cache[value];
}
