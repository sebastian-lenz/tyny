export function debounce(func, wait, immediate) {
    let timeout = null;
    let args = null;
    let context = null;
    let timestamp;
    let result;
    function later() {
        const last = Date.now() - timestamp;
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
        const callNow = immediate && !timeout;
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
