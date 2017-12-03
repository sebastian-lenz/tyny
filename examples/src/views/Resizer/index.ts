import { $, PointerListEvent, View, ViewOptions } from 'tyny';
import { viewport } from 'tyny-services/lib/viewport';

import './index.styl';

export interface ResizerOptions extends ViewOptions {
  handleBottom?: string | HTMLElement;
  handleRight?: string | HTMLElement;
}

export type ResizerMode = 'height' | 'width' | undefined;

@$.component('.tynyResizer', { allowChildComponents: true })
export default class Resizer extends View {
  @$.data({ type: 'element', defaultValue: '.handleBottom' })
  private handleBottom: HTMLElement;

  @$.data({ type: 'element', defaultValue: '.handleRight' })
  private handleRight: HTMLElement;

  private mode: ResizerMode;
  private initialRect: ClientRect;

  constructor(options: ResizerOptions) {
    super(options);
  }

  private getModeFromEvent(event?: Event) {
    if (!event) return undefined;
    const { handleBottom, handleRight } = this;
    let handle: HTMLElement | null = <HTMLElement>event.target;

    while (handle) {
      if (handle === handleBottom) return 'height';
      if (handle === handleRight) return 'width';
      handle = handle.parentElement;
    }

    return undefined;
  }

  @$.pointerEvent('add')
  private handlePointerAdd(event: PointerListEvent) {
    const mode = event.target.hasPointers()
      ? undefined
      : this.getModeFromEvent(event.nativeEvent);

    if (!mode) {
      event.preventDefault();
    } else {
      this.initialRect = this.element.getBoundingClientRect();
    }

    this.mode = mode;
  }

  @$.pointerEvent('update')
  private handlePointerUpdate(event: PointerListEvent) {
    const { element, initialRect, mode } = this;
    const { x, y } = event.pointer.getDelta();

    if (mode === 'height') {
      element.style.height = `${initialRect.height + y}px`;
    } else if (mode === 'width') {
      element.style.width = `${initialRect.width + x}px`;
    }

    viewport().triggerResize();
  }
}
