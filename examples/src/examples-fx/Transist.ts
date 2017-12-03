import { $, View, ViewOptions } from 'tyny';
import { transist } from 'tyny-fx';

@$.component('.tynyFxTransist')
export default class FxTransist extends View {
  @$.data({ type: 'element', defaultValue: '.circle' })
  circle: HTMLElement;

  constructor(options: ViewOptions) {
    super(options);
    this.startTransist();
  }

  startTransist() {
    const { circle } = this;
    const animation = transist(circle, {
      transform: 'translate(100px, 0)',
    });

    animation
      .then(() =>
        transist(circle, {
          transform: 'translate(-100px, 0)',
        })
      )
      .then(() => {
        this.startTransist();
      });
  }
}
