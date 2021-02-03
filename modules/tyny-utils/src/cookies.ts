/*
 * Cookies.js - 1.2.1
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
export interface CookieOptions {
  path?: string;
  domain?: string;
  expires?: Date;
  secure?: boolean;
}

function Cookies(key: string, value?: any, options?: CookieOptions) {
  return arguments.length === 1
    ? Cookies.get(key)
    : Cookies.set(key, value, options);
}

namespace Cookies {
  // Allows for setter injection in unit tests
  const _document = window.document;

  // Used to ensure cookie keys do not collide with
  // built-in `Object` properties
  const _cacheKeyPrefix = 'tyny.';

  const _maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

  export const defaults: CookieOptions = {
    path: '/',
    secure: false,
  };

  let _cache: any = {};

  let _cachedDocumentCookie: string = '';

  export function get(key: string): string {
    if (_cachedDocumentCookie !== _document.cookie) {
      _renewCache();
    }

    return _cache[_cacheKeyPrefix + key];
  }

  export function set(
    key: string,
    value: any,
    options?: CookieOptions
  ): typeof Cookies {
    options = _getExtendedOptions(options);
    options.expires = _getExpiresDate(
      value === undefined ? -1 : options.expires
    );

    _document.cookie = _generateCookieString(key, value, options);

    return Cookies;
  }

  export function expire(key: string, options?: CookieOptions) {
    return set(key, undefined, options);
  }

  function _getExtendedOptions(options?: CookieOptions): CookieOptions {
    return {
      path: (options && options.path) || defaults.path,
      domain: (options && options.domain) || defaults.domain,
      expires: (options && options.expires) || defaults.expires,
      secure:
        options && options.secure !== undefined
          ? options.secure
          : defaults.secure,
    };
  }

  function _isValidDate(date: Date): boolean {
    return (
      Object.prototype.toString.call(date) === '[object Date]' &&
      !isNaN(date.getTime())
    );
  }

  function _getExpiresDate(expires: any, now?: Date): Date {
    now = now || new Date();

    if (typeof expires === 'number') {
      expires =
        expires === Infinity
          ? _maxExpireDate
          : new Date(now.getTime() + expires * 1000);
    } else if (typeof expires === 'string') {
      expires = new Date(expires);
    }

    if (expires && !_isValidDate(expires)) {
      throw new Error(
        '`expires` parameter cannot be converted to a valid Date instance'
      );
    }

    return expires;
  }

  function _generateCookieString(
    key: string,
    value: string,
    options: CookieOptions
  ): string {
    key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
    key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
    value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
    options = options || {};

    var cookieString = key + '=' + value;
    cookieString += options.path ? ';path=' + options.path : '';
    cookieString += options.domain ? ';domain=' + options.domain : '';
    cookieString += options.expires
      ? ';expires=' + options.expires.toUTCString()
      : '';
    cookieString += options.secure ? ';secure' : '';

    return cookieString;
  }

  function _getCacheFromString(documentCookie: string): any {
    const cookieCache: any = {};
    const cookiesArray = documentCookie ? documentCookie.split('; ') : [];

    for (let i = 0; i < cookiesArray.length; i++) {
      const cookieKvp = _getKeyValuePairFromCookieString(cookiesArray[i]);
      const key = _cacheKeyPrefix + cookieKvp.key;
      if (cookieCache[key] === undefined) {
        cookieCache[key] = cookieKvp.value;
      }
    }

    return cookieCache;
  }

  function _getKeyValuePairFromCookieString(cookieString: string) {
    // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
    var separatorIndex = cookieString.indexOf('=');

    // IE omits the "=" when the cookie value is an empty string
    separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

    return {
      key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
      value: decodeURIComponent(cookieString.substr(separatorIndex + 1)),
    };
  }

  function _renewCache() {
    _cache = _getCacheFromString(_document.cookie);
    _cachedDocumentCookie = _document.cookie;
  }

  function _areEnabled(): boolean {
    const testKey = 'tyny';
    const areEnabled = set(testKey, 1).get(testKey) === '1';
    expire(testKey);
    return areEnabled;
  }

  var enabled: boolean = _areEnabled();
}

export default Cookies;
