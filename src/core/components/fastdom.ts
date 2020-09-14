const reads: Array<FastDomTask> = [];
const recursionLimit: number = 5;
const writes: Array<FastDomTask> = [];
let scheduled = false;

function flush(recursion: number = 1) {
  runTasks(reads);
  runTasks(writes.splice(0, writes.length));

  scheduled = false;
  if (reads.length || writes.length) {
    scheduleFlush(recursion + 1);
  }
}

function scheduleFlush(recursion: number = 1) {
  if (!scheduled) {
    scheduled = true;

    if (recursion > recursionLimit) {
      throw new Error('Maximum recursion limit reached.');
    } else if (recursion) {
      Promise.resolve().then(() => flush(recursion));
    } else {
      requestAnimationFrame(() => flush());
    }
  }
}

function runTasks(tasks: Array<FastDomTask>) {
  let task;
  while ((task = tasks.shift())) {
    task();
  }
}

function remove<T>(array: Array<T>, item: T) {
  const index = array.indexOf(item);
  return !!~index && !!array.splice(index, 1);
}

export type FastDomTask = { (): FastDomTask | void };

export const fastDom = {
  get reads(): Array<FastDomTask> {
    return reads;
  },

  get scheduled(): boolean {
    return scheduled;
  },

  get writes(): Array<FastDomTask> {
    return writes;
  },

  read(task: FastDomTask) {
    this.reads.push(task);
    scheduleFlush();
    return task;
  },

  write(task: FastDomTask) {
    this.writes.push(task);
    scheduleFlush();
    return task;
  },

  clear(task: FastDomTask) {
    return remove(this.reads, task) || remove(this.writes, task);
  },

  flush,
};
