import { $, View, ViewOptions } from 'tyny';
import { visibility, VisibilityTarget } from 'tyny-services';
import dissolve from 'tyny-fx/lib/transitions/dissolve';

import ImageCrop from '../ImageCrop/index';
import RatioSet, { RatioSetSource } from './RatioSet';
import Swap, { SwapOptions } from '../Swap/index';

export interface ImageRatiosOptions extends ViewOptions {
  disableVisibility?: boolean;
  ratioSet?: RatioSet | RatioSetSource;
}

export interface InternalImageRatiosOptions extends SwapOptions {
  disableVisibility?: boolean;
  ratioSet?: RatioSet | RatioSetSource;
}

export default class ImageRatios extends Swap<
  InternalImageRatiosOptions,
  ImageCrop
> implements VisibilityTarget {
  @$.data({ type: 'class', ctor: RatioSet })
  ratioSet: RatioSet;

  inViewport: boolean;

  constructor(options: ImageRatiosOptions) {
    super({
      className: `${View.classNamePrefix}ImageRatios`,
      ...options,
      appendContent: true,
      disposeContent: true,
      transition: dissolve(),
      transist: null,
    });
  }

  setInViewport(inViewport: boolean) {
    if (this.inViewport == inViewport) return;
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
      const image = new ImageCrop({
        appendTo: element,
        crop,
        disableVisibility: true,
        image: {
          height: crop.height,
          sourceSet: crop.sourceSet,
          width: crop.width,
        },
      });

      this.setContent(image);
    }
  }

  protected initialize(options: InternalImageRatiosOptions) {
    super.initialize(options);
    if (!options.disableVisibility) {
      visibility.register(this);
    }
  }

  protected handleDispose() {
    visibility.unregister(this);
  }

  protected handleResize() {
    this.update();
  }
}
