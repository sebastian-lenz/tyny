import { $, View, ViewOptions } from 'tyny';
import { visibility, VisibilityTarget } from 'tyny-services';

import Crop, { CropOptions } from './Crop';
import Image, { ImageOptions } from '../Image/index';
import ImageCropEvent from './ImageCropEvent';

/**
 * Constructor options for the ImageWrap class.
 */
export interface ImageCropOptions extends ViewOptions {
  crop: Crop | CropOptions | string;

  /**
   * Whether to disable the visibility check or not.
   */
  disableVisibility?: boolean;

  image?: ImageOptions;
}

/**
 * Wraps an Image view and allows to apply various scale modes to the image.
 */
export default class ImageCrop extends View<ImageCropOptions>
  implements VisibilityTarget {
  /**
   * The scale mode used to transform the image.
   */
  @$.data({ type: 'class', ctor: Crop })
  crop: Crop;

  /**
   * The image instance displayed by this wrapper.
   */
  @$.child({
    autoCreate: true,
    factory: (owner: View, options: ViewOptions, element?: HTMLElement) =>
      new Image({
        ...'image' in options ? (<any>options).image : {},
        appendTo: owner.element,
        disableVisibility: true,
        element,
        owner,
      }),
    selector: 'img',
    viewClass: Image,
  })
  image: Image;

  /**
   * Whether this element is currently within the visible viewport bounds or not.
   */
  inViewport: boolean;

  constructor(options: ImageCropOptions) {
    super({
      className: `${View.classNamePrefix}ImageCrop`,
      ...options,
    });
  }

  /**
   * Load the image.
   *
   * @returns
   *   A promise that resolves after the image has loaded.
   */
  load(): Promise<void> {
    this.inViewport = true;
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
   * Initialize this view.
   */
  protected initialize(options: ImageCropOptions) {
    const { image } = this;
    this.listenToOnce(image, 'load', this.handleImageLoad);

    if (!options.disableVisibility) {
      visibility.register(this);
    }
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
    visibility.unregister(this);
  }

  protected handleResize() {
    this.update();
  }
}
