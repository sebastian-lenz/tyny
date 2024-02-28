import { IFrameAdapter } from './IFrameAdapter';

export class VimeoAdapter extends IFrameAdapter {
  constructor(el: HTMLIFrameElement) {
    super(el);

    const uid = this.url.getParam('player_id');
    if (uid && typeof uid === 'string') {
      this.uid = parseInt(uid);
    }
  }

  play() {
    this.post({ method: 'play' });
  }

  pause() {
    this.post({ method: 'pause' });
  }

  mute() {
    this.post({ method: 'setVolume', value: 0 });
  }

  protected createApi(): Promise<void> {
    const { uid, url } = this;

    if (!url.getParam('api') || !url.getParam('player_id')) {
      this.url = url.setParam('api', '1').setParam('player_id', `${uid}`);
    }

    return new Promise((resolve) => {
      this.awaitMessage(({ player_id }) => parseInt(player_id) === uid).then(
        () => {
          resolve();
        }
      );
    });
  }
}
