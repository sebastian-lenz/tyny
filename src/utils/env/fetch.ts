export interface FetchOptions {
  body?: Document | XMLHttpRequestBodyInit | null;
  credentials?: string;
  headers?: tyny.Map<string>;
  method?: string;
}

export interface FetchResponse {
  ok: boolean;
  statusText: string;
  status: number;
  url: string;
  text: () => Promise<string>;
  json: () => Promise<any>;
  blob: () => Promise<Blob>;
  clone: () => FetchResponse;
  headers: {
    keys(): string[];
    entries(): [string, string][];
    get(n: string): string | undefined;
    has(n: string): boolean;
  };
}

export function fetch(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResponse> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const keys: string[] = [];
    const all: [string, string][] = [];
    const headers: tyny.Map<string> = {};

    const response = () =>
      ({
        ok: ((request.status / 100) | 0) == 2, // 200-299
        statusText: request.statusText,
        status: request.status,
        url: request.responseURL,
        text: () => Promise.resolve(request.responseText),
        json: () => Promise.resolve(request.responseText).then(JSON.parse),
        blob: () => Promise.resolve(new Blob([request.response])),
        clone: response,
        headers: {
          keys: () => keys,
          entries: () => all,
          get: (n) => headers[n.toLowerCase()],
          has: (n) => n.toLowerCase() in headers,
        },
      } as FetchResponse);

    request.open(options.method || 'get', url, true);
    request.onerror = reject;
    request.withCredentials = options.credentials == 'include';

    for (const i in options.headers) {
      request.setRequestHeader(i, options.headers[i]);
    }

    request.onload = () => {
      request
        .getAllResponseHeaders()
        .replace(
          /^(.*?):[^\S\n]*([\s\S]*?)$/gm,
          (match: string, key: string, value: string) => {
            keys.push((key = key.toLowerCase()));
            all.push([key, value]);
            headers[key] = headers[key] ? `${headers[key]},${value}` : value;
            return match;
          }
        );
      resolve(response());
    };

    request.send(options.body || null);
  });
}
