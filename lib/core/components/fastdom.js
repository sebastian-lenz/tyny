const reads = [];
const recursionLimit = 5;
const writes = [];
let scheduled = false;
function flush(recursion = 1) {
    runTasks(reads);
    runTasks(writes.splice(0, writes.length));
    scheduled = false;
    if (reads.length || writes.length) {
        scheduleFlush(recursion + 1);
    }
}
function scheduleFlush(recursion = 1) {
    if (!scheduled) {
        scheduled = true;
        if (recursion > recursionLimit) {
            throw new Error('Maximum recursion limit reached.');
        }
        else if (recursion) {
            Promise.resolve().then(() => flush(recursion));
        }
        else {
            requestAnimationFrame(() => flush());
        }
    }
}
function runTasks(tasks) {
    let task;
    while ((task = tasks.shift())) {
        task();
    }
}
function remove(array, item) {
    const index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}
export const fastDom = {
    get reads() {
        return reads;
    },
    get scheduled() {
        return scheduled;
    },
    get writes() {
        return writes;
    },
    read(task) {
        this.reads.push(task);
        scheduleFlush();
        return task;
    },
    write(task) {
        this.writes.push(task);
        scheduleFlush();
        return task;
    },
    clear(task) {
        return remove(this.reads, task) || remove(this.writes, task);
    },
    flush,
};
