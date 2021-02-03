export function each(obj, cb) {
    for (var key in obj) {
        if (false === cb(obj[key], key)) {
            return false;
        }
    }
    return true;
}
