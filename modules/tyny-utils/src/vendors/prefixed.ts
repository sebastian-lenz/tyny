import ucfirst from '../ucfirst';

export interface PrefixOptions {
  events: string[];
  filter: Function;
  styles: string[];
  vendors: PrefixVendor[];
}

export interface PrefixVendor {
  eventCamelCase?: boolean;
  eventPrefix?: string;
  prefix?: string;
}

function vendorize(options: PrefixOptions, vendor: PrefixVendor = {}): any {
  const { events, filter, styles } = options;
  const { eventCamelCase, eventPrefix = '', prefix = '' } = vendor;
  const result: any = {};

  events.forEach(event => {
    result[`on${ucfirst(event)}`] = eventPrefix
      ? `${eventPrefix}${eventCamelCase ? ucfirst(event) : event.toLowerCase()}`
      : `${eventCamelCase ? event : event.toLowerCase()}`;
  });

  styles.forEach(style => {
    result[style] = `${prefix}${prefix ? ucfirst(style) : style}`;
  });

  return filter(result, vendor);
}

function empty(options: PrefixOptions) {
  const { events, filter, styles } = options;
  const result: any = {};

  events.forEach(event => (result[`on${ucfirst(event)}`] = ''));
  styles.forEach(style => (result[style] = ''));

  return filter(result);
}

export default function prefixed(options: PrefixOptions): any {
  const { styles, vendors } = options;
  const element = document.createElement('div');
  const style = <any>element.style;
  let styleName = styles[0];

  if (style[styleName] !== undefined) {
    return vendorize(options);
  }

  styleName = ucfirst(styleName);
  for (let i = 0; i < vendors.length; i++) {
    const vendor = vendors[i];
    const { prefix } = vendors[i];
    if (style[`${prefix}${styleName}`] !== undefined) {
      return vendorize(options, vendor);
    }
  }

  return empty(options);
}
