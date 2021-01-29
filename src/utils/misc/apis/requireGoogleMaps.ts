import { Url } from '../../types/Url';

let promise: Promise<void>;

export interface GoogleMapsOptions {
  apiKey?: string;
  query?: tyny.Map<string> | null;
  endpoint?: string;
}

export function requireGoogleMaps({
  apiKey = requireGoogleMaps.apiKey,
  query = null,
  endpoint = 'https://maps.googleapis.com/maps/api/js',
}: GoogleMapsOptions = {}): Promise<void> {
  if (promise) {
    return promise;
  }

  const url = new Url(endpoint);
  if (query) url.setParams(query);
  url.setParam('callback', 'tyGmCallback');
  url.setParam('key', apiKey);

  const script = document.createElement('script');
  script.src = url.toString();
  document.head.appendChild(script);

  return (promise = new Promise((resolve) => {
    (<any>window)['tyGmCallback'] = () => {
      resolve();
    };
  }));
}

export namespace requireGoogleMaps {
  export const apiKey: string = '';
}
