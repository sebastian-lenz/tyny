var promisses = {};
var testImages = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
};
function checkWebpFeature(feature, callback) {
    var img = new Image();
    img.onload = function () {
        var result = img.width > 0 && img.height > 0;
        callback(result, feature);
    };
    img.onerror = function () {
        callback(false, feature);
    };
    img.src = 'data:image/webp;base64,' + testImages[feature];
}
export function supportsWebp(feature) {
    if (feature === void 0) { feature = 'lossy'; }
    if (feature in promisses) {
        return promisses[feature];
    }
    return (promisses[feature] = new Promise(function (resolve) {
        return checkWebpFeature(feature, resolve);
    }));
}
