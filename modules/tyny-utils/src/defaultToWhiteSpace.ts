import escapeRegExp from './escapeRegExp';

export default function defaultToWhiteSpace(characters: any): string {
  if (characters == null) {
    return '\\s';
  } else if (characters.source) {
    return characters.source;
  } else {
    return '[' + escapeRegExp(characters) + ']';
  }
}
