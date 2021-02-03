import { Url } from '../../types/Url';
let promise;
export function requireGoogleMaps({ apiKey = requireGoogleMaps.apiKey, query = null, endpoint = 'https://maps.googleapis.com/maps/api/js', } = {}) {
    if (promise) {
        return promise;
    }
    const url = new Url(endpoint);
    if (query)
        url.setParams(query);
    url.setParam('callback', 'tyGmCallback');
    url.setParam('key', apiKey);
    const script = document.createElement('script');
    script.src = url.toString();
    document.head.appendChild(script);
    return (promise = new Promise((resolve) => {
        window['tyGmCallback'] = () => {
            resolve();
        };
    }));
}
(function (requireGoogleMaps) {
    requireGoogleMaps.apiKey = '';
})(requireGoogleMaps || (requireGoogleMaps = {}));
