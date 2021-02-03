import { visibility, VisibilityTarget } from 'tyny-services/lib/visibility';
import data from 'tyny/lib/decorators/data';
import debounce from 'tyny-utils/lib/debounce';
import dissolve from 'tyny-fx/lib/transitions/dissolve';
import resizeEvent from 'tyny/lib/decorators/resizeEvent';
import View, { ViewOptions } from 'tyny/lib/View';

import { ImageCrop } from '../ImageCrop';
import { Swap, SwapOptions } from '../Swap';
import RatioSet, { RatioSetSource } from './RatioSet';

export interface ImageRatiosOptions extends ViewOptions {
  disableVisibility?: boolean;
  ratioSet?: RatioSet | RatioSetSource;
}

export default class ImageRatios extends Swap<ImageCrop>
  implements VisibilityTarget {
  debouncedUpdate: Function;
  inViewport: boolean = false;
  ratioSet: RatioSet;

  constructor(options: ImageRatiosOptions) {
    super({
      className: `${View.classNamePrefix}ImageRatios`,
      transition: dissolve({ duration: 200, noPureFadeIn: true }),
      ...options,
      appendContent: true,
      disposeContent: true,
      transist: null,
    });

    this.ratioSet = this.createArgs().instance({
      attribute: 'data-ratioset',
      ctor: RatioSet,
      name: 'ratioSet',
    });

    this.debouncedUpdate = debounce(this.update, 50);

    if (!options.disableVisibility) {
      visibility().register(this);
    }
  }

  load(): Promise<void> {
    this.inViewport = true;
    this.update();

    if (!this.content) {
      return Promise.resolve();
    }

    return this.content.load();
  }

  setInViewport(inViewport: boolean) {
    if (this.inViewport === inViewport) return;
    this.inViewport = inViewport;
    this.update();

    const { content } = this;
    if (content) {
      content.setInViewport(inViewport);
    }
  }

  update() {
    const { content, element, inViewport, ratioSet } = this;
    if (!inViewport) return;

    const crop = ratioSet.get(element.offsetWidth, element.offsetHeight);
    if (crop && (!content || content.crop !== crop)) {
      this.setContent(
        new ImageCrop({
          appendTo: element,
          crop,
          disableVisibility: true,
          imageOptions: {
            height: crop.height,
            sourceSet: crop.sourceSet,
            width: crop.width,
          },
        })
      );
    }
  }

  protected handleDispose() {
    visibility().unregister(this);
  }

  @resizeEvent(true)
  protected handleResize() {
    this.debouncedUpdate();
  }
}
