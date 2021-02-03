import { Url } from '../../types/Url';
var promise;
export function requireGoogleMaps(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.apiKey, apiKey = _c === void 0 ? requireGoogleMaps.apiKey : _c, _d = _b.query, query = _d === void 0 ? null : _d, _e = _b.endpoint, endpoint = _e === void 0 ? 'https://maps.googleapis.com/maps/api/js' : _e;
    if (promise) {
        return promise;
    }
    var url = new Url(endpoint);
    if (query)
        url.setParams(query);
    url.setParam('callback', 'tyGmCallback');
    url.setParam('key', apiKey);
    var script = document.createElement('script');
    script.src = url.toString();
    document.head.appendChild(script);
    return (promise = new Promise(function (resolve) {
        window['tyGmCallback'] = function () {
            resolve();
        };
    }));
}
(function (requireGoogleMaps) {
    requireGoogleMaps.apiKey = '';
})(requireGoogleMaps || (requireGoogleMaps = {}));
