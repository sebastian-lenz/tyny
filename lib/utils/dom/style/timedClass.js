const handles = [];
export function timedClass(el, className, delay) {
    const index = handles.findIndex((handle) => handle.className === className && handle.el === el);
    if (index !== -1) {
        clearTimeout(handles[index].handle);
        handles.splice(index, 1);
    }
    return new Promise((resolve) => {
        el.classList.add(className);
        handles.push({
            className,
            el,
            handle: setTimeout(() => {
                el.classList.remove(className);
                resolve();
            }, delay),
        });
    });
}
