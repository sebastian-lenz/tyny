import { isImageLoaded } from 'tyny-utils';
import { visibility, VisibilityTarget } from 'tyny-services/lib/visibility';
import View, { ViewOptions } from 'tyny/lib/View';
import data from 'tyny/lib/decorators/data';
import resizeEvent from 'tyny/lib/decorators/resizeEvent';

import ImageEvent from './ImageEvent';
import SourceSet, { SourceSetSource } from './SourceSet';

/**
 * Constructor options for the Image class.
 */
export interface ImageOptions extends ViewOptions {
  /**
   * Whether to disable the visibility check or not.
   */
  disableVisibility?: boolean;

  height?: number;

  /**
   * The source set definition that should be used.
   */
  sourceSet?: SourceSet | SourceSetSource;

  width?: number;
}

/**
 * Displays an image.
 */
export default class Image extends View implements VisibilityTarget {
  /**
   * The natural height of this image.
   */
  @data({ type: 'int', attributeName: 'height', defaultValue: Number.NaN })
  height: number;

  /**
   * The natural width of this image.
   */
  @data({ type: 'int', attributeName: 'width', defaultValue: Number.NaN })
  width: number;

  /**
   * The set of source files used by this image.
   */
  @data({ type: 'class', ctor: SourceSet, attributeName: 'data-srcset' })
  sourceSet: SourceSet;

  readonly element: HTMLImageElement;

  /**
   * Whether this element is currently within the visible viewport bounds or not.
   */
  isInViewport: boolean = false;

  promise: Promise<void>;

  /**
   * Image constructor.
   *
   * @param options
   *   The constructor options.
   */
  constructor(options: ImageOptions = {}) {
    super(
      (options = {
        className: `${View.classNamePrefix}Image`,
        ...options,
        tagName: 'img',
      })
    );

    const { element } = this;
    this.promise = new Promise(resolve => {
      const handleLoad = () => {
        this.undelegate('load', handleLoad);
        resolve();
      };

      if (isImageLoaded(element)) {
        resolve();
      } else {
        this.delegate('load', handleLoad);
      }
    }).then(() => {
      const { naturalHeight, naturalWidth } = element;

      if (isNaN(this.height)) {
        this.height = naturalHeight;
      }

      if (isNaN(this.width)) {
        this.width = naturalWidth;
      }

      element.classList.add('loaded');
      this.emit(
        new ImageEvent({
          target: this,
          type: ImageEvent.loadEvent,
        })
      );
    });

    if (!options.disableVisibility) {
      visibility().register(this);
    }
  }

  /**
   * Set whether the element of this view is currently within the visible bounds
   * of the viewport or not.
   *
   * @param inViewport
   *   TRUE if the element is visible, FALSE otherwise.
   */
  setInViewport(inViewport: boolean) {
    if (this.isInViewport === inViewport) return;
    this.isInViewport = inViewport;

    if (inViewport) {
      this.update();
    }
  }

  /**
   * Update the source location of the image due to the current dimensions.
   */
  update() {
    const { element, isInViewport, sourceSet } = this;
    if (isInViewport && sourceSet) {
      element.src = sourceSet.get(element.offsetWidth);
    }
  }

  /**
   * Load the image.
   *
   * @returns
   *   A promise that resolves after the image has loaded.
   */
  load(): Promise<void> {
    this.isInViewport = true;
    this.update();
    return this.promise;
  }

  protected handleDispose() {
    visibility().unregister(this);
  }

  @resizeEvent()
  protected handleResize() {
    this.update();
  }
}
