import { Crop, CropOptions } from '../ImageCrop/Crop';
import { data } from '../../utils/dom/attr';
import { property, update, View, ViewOptions } from '../../core';
import { Source } from './Source';
import { tween } from '../../fx/tween';
import { visibility, VisibilityTarget } from '../../services/visibility';

function renderImage(
  ctx: CanvasRenderingContext2D,
  { image, source }: PictureImage,
  maskWidth: number,
  maskHeight: number
) {
  const crop = source.getCrop(maskWidth, maskHeight);
  ctx.drawImage(image, crop.left, crop.top, crop.width, crop.height);
}

export interface PictureImage {
  image: HTMLImageElement;
  isLoaded: boolean;
  source: Source;
  url: string;
}

export interface PictureOptions extends ViewOptions, Partial<CropOptions> {
  crop?: Crop | CropOptions;
}

export class Picture extends View implements VisibilityTarget {
  protected currentImage: PictureImage | null = null;
  protected displayHeight: number = 0;
  protected displayWidth: number = 0;
  protected images: tyny.Map<PictureImage> = {};
  protected isVisible: boolean = false;
  protected nextImage: PictureImage | null = null;
  protected sources: Source[];
  protected progress: number = 0;

  @property({
    immutable: true,
    param: { defaultValue: 'canvas', tagName: 'canvas', type: 'element' },
  })
  protected canvas!: HTMLCanvasElement | null;

  constructor(options: PictureOptions = {}) {
    super(options);

    const crop = Crop.create(this, options).toOptions();
    this.sources = this.findAll('source').map(
      (source) =>
        new Source({
          ...crop,
          height: parseInt(data(source, 'height') || '0'),
          sourceSet: data(source, 'srcset') || '',
          width: parseInt(data(source, 'width') || '0'),
        })
    );
  }

  setVisible(value: boolean) {
    this.isVisible = value;
    if (value) this.updateImage();
  }

  protected findSource(
    width: number = this.displayWidth,
    height: number = this.displayHeight
  ): Source | null {
    const { sources } = this;
    const aspect = height / width;
    let bestSource: Source | null = null;
    let bestScore: number = Number.MAX_VALUE;

    for (let index = 0; index < sources.length; index++) {
      const source = sources[index];
      const sourceAspect = source.height / source.width;
      const score =
        Math.abs(aspect - sourceAspect) +
        (source.height < height || source.width < width ? 10 : 0);

      if (score < bestScore) {
        bestSource = source;
        bestScore = score;
      }
    }

    return bestSource;
  }

  protected getImage(source: Source, url: string) {
    const { images } = this;
    if (!(url in images)) {
      const image = document.createElement('img');
      const item: PictureImage = (images[url] = {
        image,
        isLoaded: false,
        source,
        url,
      });

      image.src = url;
      item.isLoaded = !!image.complete;
      image.addEventListener('load', () => {
        item.isLoaded = true;
        this.tryTransist();
      });
    }

    return images[url];
  }

  protected onConnected() {
    super.onConnected();
    visibility.observe(this);
  }

  protected onDisconnected() {
    super.onDisconnected();
    visibility.unobserve(this);
  }

  @update({ events: 'resize', mode: 'read' })
  protected onMeasure() {
    const { displayHeight, displayWidth, el } = this;
    const ratio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    const height = el.clientHeight * ratio;
    const width = el.clientWidth * ratio;

    if (height !== displayHeight || width !== displayWidth) {
      this.displayHeight = height;
      this.displayWidth = width;

      this.updateImage();
      return this.onSizeChanged;
    }
  }

  protected onSizeChanged() {
    const { canvas, displayHeight, displayWidth } = this;
    if (canvas) {
      canvas.height = displayHeight;
      canvas.width = displayWidth;
    }

    this.render();
  }

  protected onTransitionEnd() {
    this.currentImage = this.nextImage;
    this.nextImage = null;
    this.progress = 0;
    this.updateImage();
    this.render();
  }

  protected render() {
    const { canvas, currentImage, nextImage, progress } = this;
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (!ctx) {
      return;
    }

    const height = this.displayHeight;
    const width = this.displayWidth;
    ctx.clearRect(0, 0, width, height);

    if (currentImage) {
      ctx.globalAlpha = 1;
      renderImage(ctx, currentImage, width, height);
    }

    if (nextImage && progress) {
      ctx.globalAlpha = progress;
      renderImage(ctx, nextImage, width, height);
    }
  }

  protected setProgress(value: number) {
    this.progress = value;
    this.render();
  }

  protected tryTransist() {
    const { nextImage, progress } = this;
    if (!nextImage || !nextImage.isLoaded || progress) {
      return;
    }

    tween(this, { progress: 1 }, { duration: 100 }).then(() => {
      this.onTransitionEnd();
    });
  }

  protected updateImage() {
    const { currentImage, isVisible, nextImage, progress } = this;
    const source = this.findSource();
    if (!source || !isVisible || (nextImage && progress)) return;

    const url = source.sourceSet.get(this.displayWidth);
    const image = this.getImage(source, url);
    if ((currentImage === image && !nextImage) || nextImage === image) return;

    this.nextImage = image;
    this.tryTransist();
  }
}
