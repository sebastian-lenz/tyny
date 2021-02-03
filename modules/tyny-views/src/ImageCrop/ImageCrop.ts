import { visibility, VisibilityTarget } from 'tyny-services/lib/visibility';
import View, { ViewOptions } from 'tyny/lib/View';
import child from 'tyny/lib/decorators/child';
import data from 'tyny/lib/decorators/data';
import resizeEvent from 'tyny/lib/decorators/resizeEvent';

import { Image, ImageOptions } from '../Image';
import Crop, { CropMode, CropOptions, CropResult } from './Crop';
import ImageCropEvent from './ImageCropEvent';

/**
 * Constructor options for the ImageWrap class.
 */
export interface ImageCropOptions extends ViewOptions {
  crop?: Crop | CropOptions;

  /**
   * Whether to disable the visibility check or not.
   */
  disableVisibility?: boolean;

  imageOptions?: ImageOptions;
}

/**
 * Wraps an Image view and allows to apply various scale modes to the image.
 */
export default class ImageCrop extends View implements VisibilityTarget {
  /**
   * The scale mode used to transform the image.
   */
  crop: Crop;

  /**
   * The image instance displayed by this wrapper.
   */
  image: Image;

  /**
   * Whether this element is currently within the visible viewport bounds or not.
   */
  inViewport: boolean = false;

  currentCrop: CropResult | null = null;

  constructor(options: ImageCropOptions = {}) {
    super({
      className: `${View.classNamePrefix}ImageCrop`,
      ...options,
    });

    const { imageOptions = {} } = options;
    const args = this.createArgs(options);
    const crop = args.instance({
      ctor: Crop,
      name: 'crop',
    });

    const image = new Image({
      ...imageOptions,
      appendTo: this.element,
      disableVisibility: true,
      element: this.query('img'),
      owner: this,
    });

    crop.width = image.width;
    crop.height = image.height;

    this.crop = crop;
    this.image = image;
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
    this.currentCrop = crop.apply(element, image.element);
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
