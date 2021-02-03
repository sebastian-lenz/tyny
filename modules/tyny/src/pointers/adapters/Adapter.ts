import { Delegate, DelegateMap } from 'tyny-events';
import { viewport } from 'tyny-services/lib/viewport';

import PointerList from '../PointerList';

export default abstract class Adapter extends Delegate {
  protected isTracking: boolean = false;
  protected pointerList: PointerList;

  constructor(element: HTMLElement, pointerList: PointerList) {
    super(element);
    this.pointerList = pointerList;

    this.listenTo(pointerList, 'commit', this.handleListCommit);
    this.delegateEvents(this.getEvents(), { passive: false });
  }

  dispose() {
    super.dispose();
    this.stopTracking();
  }

  protected abstract getEvents(): DelegateMap;

  protected abstract getTrackingEvents(): DelegateMap;

  protected startTracking() {
    if (this.isTracking) return;
    this.isTracking = true;

    const events = this.getTrackingEvents();
    viewport().delegateEvents(events, { passive: false, scope: this });
  }

  protected stopTracking() {
    if (!this.isTracking) return;
    this.isTracking = false;

    const events = this.getTrackingEvents();
    viewport().undelegateEvents(events, { passive: false, scope: this });
  }

  protected handleListCommit() {
    const shouldListen = this.pointerList.hasPointersOfAdapter(this);
    if (shouldListen) {
      this.startTracking();
    } else {
      this.stopTracking();
    }
  }
}
