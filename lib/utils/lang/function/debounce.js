/**
 * Returns a function, that, as long as it continues to be invoked,
 * will not be triggered.
 *
 * The function will be called after it stops being called for N
 * milliseconds. If immediate is passed, trigger the function on the
 * leading edge, instead of the trailing.
 */
export function debounce(func, wait, immediate) {
    var timeout = null;
    var args = null;
    var context = null;
    var timestamp;
    var result;
    function later() {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = window.setTimeout(later, wait - last);
        }
        else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            }
        }
    }
    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) {
            timeout = window.setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}
