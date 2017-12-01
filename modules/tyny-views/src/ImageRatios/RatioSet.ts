import Ratio, { RatioOptions } from './Ratio';

export type RatioSetSource = string | Array<Ratio | RatioOptions>;

export default class RatioSet {
  ratios: Ratio[];

  constructor(source?: RatioSetSource) {
    let sources: Array<Ratio | RatioOptions> | undefined;
    if (typeof source === 'string') {
      sources = <RatioOptions[]>JSON.parse(source);
    } else if (source) {
      sources = source;
    }

    if (sources) {
      this.ratios = sources.map(
        source => (source instanceof Ratio ? source : new Ratio(source))
      );
    } else {
      this.ratios = [];
    }
  }

  get(width: number, height: number): Ratio | undefined {
    const { ratios } = this;
    const aspect = height / width;
    let bestRatio: Ratio | undefined;
    let bestScore: number = Number.MAX_VALUE;

    for (let index = 0; index < ratios.length; index++) {
      const ratio = ratios[index];
      const ratioAspect = ratio.height / ratio.width;
      const score =
        Math.abs(aspect - ratioAspect) +
        (ratio.height < height || ratio.width < width ? 10 : 0);

      if (score < bestScore) {
        bestRatio = ratio;
        bestScore = score;
      }
    }

    return bestRatio;
  }
}
