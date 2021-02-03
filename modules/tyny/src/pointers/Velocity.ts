export interface VelocityData {
  [name: string]: number;
}

export interface VelocitySample<T extends VelocityData> {
  time: number;
  data: T;
}

export interface VelocityFactory<T> {
  (): T;
}

export default class Velocity<T extends VelocityData> {
  trackingPeriod = 100;
  private factory: VelocityFactory<T>;
  private samples: VelocitySample<T>[] = [];

  constructor(factory: VelocityFactory<T>) {
    this.factory = factory;
  }

  get(): T {
    this.revise();

    const { factory, samples } = this;
    const result: T = factory();
    if (samples.length < 2) {
      return result;
    }

    const first = samples[0];
    const last = samples[samples.length - 1];
    const scale = 1 / ((last.time - first.time) / 15);
    if (!isFinite(scale)) {
      return result;
    }

    Object.keys(result).forEach(key => {
      result[key] = (last.data[key] - first.data[key]) * scale;
    });

    return result;
  }

  push(data: T) {
    this.revise();
    this.samples.push({
      data,
      time: Date.now(),
    });
  }

  revise() {
    const { samples, trackingPeriod } = this;
    const now = Date.now();

    while (samples.length && now - samples[0].time > trackingPeriod) {
      samples.shift();
    }
  }
}
