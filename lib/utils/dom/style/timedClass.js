var handles = [];
export function timedClass(el, className, delay) {
    var index = handles.findIndex(function (handle) { return handle.className === className && handle.el === el; });
    if (index !== -1) {
        clearTimeout(handles[index].handle);
        handles.splice(index, 1);
    }
    return new Promise(function (resolve) {
        el.classList.add(className);
        handles.push({
            className: className,
            el: el,
            handle: setTimeout(function () {
                el.classList.remove(className);
                resolve();
            }, delay),
        });
    });
}
