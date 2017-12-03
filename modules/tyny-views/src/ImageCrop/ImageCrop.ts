import { visibility, VisibilityTarget } from 'tyny-services/lib/visibility';
import View, { ViewOptions } from 'tyny/lib/View';
import child from 'tyny/lib/decorators/child';
import data from 'tyny/lib/decorators/data';
import resizeEvent from 'tyny/lib/decorators/resizeEvent';

import { Image, ImageOptions } from '../Image';
import Crop, { CropMode, CropOptions } from './Crop';
import ImageCropEvent from './ImageCropEvent';

function createImage(
  owner: ImageCrop,
  ownerOptions: ImageCropOptions,
  element?: HTMLElement
) {
  return new Image({
    ...(ownerOptions.image || {}),
    appendTo: owner.element,
    disableVisibility: true,
    element,
    owner,
  });
}

/**
 * Constructor options for the ImageWrap class.
 */
export interface ImageCropOptions extends ViewOptions {
  crop?: Crop | CropOptions;

  /**
   * Whether to disable the visibility check or not.
   */
  disableVisibility?: boolean;

  image?: ImageOptions;
}

/**
 * Wraps an Image view and allows to apply various scale modes to the image.
 */
export default class ImageCrop extends View implements VisibilityTarget {
  /**
   * The scale mode used to transform the image.
   */
  @data({ type: 'class', ctor: Crop, defaultValue: () => new Crop() })
  crop: Crop;

  /**
   * The image instance displayed by this wrapper.
   */
  @child({ autoCreate: true, factory: createImage, selector: 'img' })
  image: Image;

  /**
   * Whether this element is currently within the visible viewport bounds or not.
   */
  inViewport: boolean;

  constructor(options: ImageCropOptions = {}) {
    super({
      className: `${View.classNamePrefix}ImageCrop`,
      ...options,
    });

    const { crop, image } = this;
    crop.width = image.width;
    crop.height = image.height;

    this.listenToOnce(image, 'load', this.handleImageLoad);

    if (!options.disableVisibility) {
      visibility().register(this);
    }
  }

  /**
   * Load the image.
   *
   * @returns
   *   A promise that resolves after the image has loaded.
   */
  load(): Promise<void> {
    this.inViewport = true;
    this.update();
    return this.image.load();
  }

  /**
   * Set whether the element of this view is currently within the visible bounds
   * of the viewport or not.
   *
   * @param inViewport
   *   TRUE if the element is visible, FALSE otherwise.
   */
  setInViewport(inViewport: boolean) {
    if (this.inViewport == inViewport) return;
    this.inViewport = inViewport;

    this.update();
    this.image.setInViewport(inViewport);
  }

  update() {
    const { crop, element, image } = this;
    crop.apply(element, image.element);
  }

  /**
   * Triggered after the image has loaded.
   */
  protected handleImageLoad() {
    const { crop, element, image } = this;
    crop.width = image.width;
    crop.height = image.height;
    element.classList.add('loaded');

    this.update();
    this.emit(
      new ImageCropEvent({
        target: this,
        type: ImageCropEvent.loadEvent,
      })
    );
  }

  protected handleDispose() {
    visibility().unregister(this);
  }

  @resizeEvent(true)
  protected handleResize() {
    this.update();
  }
}
