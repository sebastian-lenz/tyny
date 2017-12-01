import { Delegate, DelegateMap } from 'tyny-events';
import { viewport } from 'tyny-services';

import PointerList from '../PointerList';

export default abstract class Adapter extends Delegate {
  protected isTracking: boolean = false;
  protected list: PointerList;

  constructor(element: HTMLElement, list: PointerList) {
    super(element);
    this.list = list;

    this.listenTo(list, 'commit', this.handleListCommit);
    this.delegateEvents(this.getEvents());
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
    viewport.delegateEvents(events, { scope: this });
  }

  protected stopTracking() {
    if (!this.isTracking) return;
    this.isTracking = false;

    const events = this.getTrackingEvents();
    viewport.undelegateEvents(events, { scope: this });
  }

  protected handleListCommit() {
    const shouldListen = this.list.hasPointersOfAdapter(this);
    if (shouldListen) {
      this.startTracking();
    } else {
      this.stopTracking();
    }
  }
}
