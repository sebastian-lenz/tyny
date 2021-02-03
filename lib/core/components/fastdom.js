var reads = [];
var recursionLimit = 5;
var writes = [];
var scheduled = false;
function flush(recursion) {
    if (recursion === void 0) { recursion = 1; }
    runTasks(reads);
    runTasks(writes.splice(0, writes.length));
    scheduled = false;
    if (reads.length || writes.length) {
        scheduleFlush(recursion + 1);
    }
}
function scheduleFlush(recursion) {
    if (recursion === void 0) { recursion = 1; }
    if (!scheduled) {
        scheduled = true;
        if (recursion > recursionLimit) {
            throw new Error('Maximum recursion limit reached.');
        }
        else if (recursion) {
            Promise.resolve().then(function () { return flush(recursion); });
        }
        else {
            requestAnimationFrame(function () { return flush(); });
        }
    }
}
function runTasks(tasks) {
    var task;
    while ((task = tasks.shift())) {
        task();
    }
}
function remove(array, item) {
    var index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}
export var fastDom = {
    get reads() {
        return reads;
    },
    get scheduled() {
        return scheduled;
    },
    get writes() {
        return writes;
    },
    read: function (task) {
        this.reads.push(task);
        scheduleFlush();
        return task;
    },
    write: function (task) {
        this.writes.push(task);
        scheduleFlush();
        return task;
    },
    clear: function (task) {
        return remove(this.reads, task) || remove(this.writes, task);
    },
    flush: flush,
};
