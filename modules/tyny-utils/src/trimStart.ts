import defaultToWhiteSpace from './defaultToWhiteSpace';

export default function trimStart(str: string, characters?: string): string {
  characters = defaultToWhiteSpace(characters);
  return str.replace(new RegExp('^' + characters + '+'), '');
}
