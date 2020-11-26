let promise: Promise<void>;

export interface GoogleMapsOptions {
  apiKey?: string;
  query?: string;
  url?: string;
}

export function requireGoogleMaps({
  apiKey = requireGoogleMaps.apiKey,
  query = '',
  url = 'https://maps.googleapis.com/maps/api/js',
}: GoogleMapsOptions = {}): Promise<void> {
  if (promise) {
    return promise;
  }

  const script = document.createElement('script');
  script.src = `${url}?key=${apiKey}&callback=tyGmCallback${query}`;
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
