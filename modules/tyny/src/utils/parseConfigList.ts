import parseConfig, { OptionDefinition } from './parseConfig';

export { OptionDefinition };

function toArray(source: any): Array<any> {
  if (Array.isArray(source)) {
    return source;
  }

  if (typeof source !== 'string') {
    return [];
  }

  try {
    const result = JSON.parse(source);
    return Array.isArray(result) ? result : [];
  } catch (e) {}

  return source
    .split('|')
    .map(source => source.trim())
    .filter(source => source !== '');
}

export default function parseConfigList<T>(options: OptionDefinition[]) {
  const parser = parseConfig<T>(options);

  return function(source: any): T[] {
    return toArray(source).map(source => parser(source));
  };
}
