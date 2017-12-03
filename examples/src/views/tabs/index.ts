import { DelegatedEvent } from 'tyny-events';
import { $, View, ViewOptions } from 'tyny';

import './index.styl';

@$.component('.tynyTabs', { allowChildComponents: true })
export default class Tabs extends View {
  @$.data({ type: 'elements', defaultValue: '.tynyTabs--body' })
  bodies: HTMLElement[];

  @$.data({ type: 'elements', defaultValue: '.tynyTabs--navItem' })
  links: HTMLElement[];

  activeIndex: number = 0;

  @$.delegate('click', { selector: '.tynyTabs--navItem' })
  handleTabClick(event: DelegatedEvent) {
    const { activeIndex, bodies, links } = this;
    const { delegateTarget } = event;
    const index = links.indexOf(delegateTarget);

    if (index !== activeIndex) {
      links[activeIndex].classList.remove('active');
      links[index].classList.add('active');

      bodies[activeIndex].classList.remove('active');
      bodies[index].classList.add('active');

      this.activeIndex = index;
    }
  }
}
