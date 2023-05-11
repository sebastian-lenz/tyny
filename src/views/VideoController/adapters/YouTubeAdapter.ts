import { on, once, trigger } from '../../../utils/dom/event';
import { IFrameAdapter } from './IFrameAdapter';
import { videoTimeEvent, VideoTimerEventArgs } from '../index';
import { AdapterSetCurrentTimeOptions } from './Adapter';

export enum YoutTubePlayerState {
  Unknown = -1, // (nicht gestartet)
  Ended = 0, // (beendet)
  Playing = 1, // (wird wiedergegeben)
  Paused = 2, // (pausiert)
  Buffering = 3, // (wird gepuffert)
  Cued = 5, // (Video positioniert)
}

export interface YouTubeStateInfo {
  apiInterface: string[];
  availablePlaybackRates: number[];
  availableQualityLevels: string[];
  currentTime: number;
  currentTimeLastUpdated_: number;
  debugText: string;
  duration: number;
  mediaReferenceTime: number;
  muted: boolean;
  option: any;
  options: Array<any>;
  playbackQuality: string;
  playbackRate: number;
  playerState: number;
  playlist: any | null;
  playlistId: any | null;
  playlistIndex: number;
  sphericalProperties: any;
  videoBytesLoaded: number;
  videoBytesTotal: number;
  videoData: {
    video_id: string;
    author: string;
    title: string;
  };
  videoEmbedCode: string;
  videoInfoVisible: boolean;
  videoLoadedFraction: number;
  videoStartBytes: number;
  videoUrl: string;
  volume: number;
}

/**
 * Potential calls are listed in `info.apiInterface`:
 * onInitialDelivery() { console.log(info.apiInterface); }
 */
export class YouTubeAdapter extends IFrameAdapter {
  info: YouTubeStateInfo | null = null;

  getCurrentTime() {
    const { info } = this;
    return info ? info.currentTime : 0;
  }

  getDuration() {
    const { info } = this;
    return info ? info.duration : 0;
  }

  getVolume() {
    const { info } = this;
    return info ? info.volume : 0;
  }

  mute() {
    this.post({ func: 'mute' });
  }

  play() {
    this.post({ func: 'playVideo' });
  }

  pause() {
    this.post({ func: 'pauseVideo' });
  }

  setCurrentTime(
    seconds: number,
    { allowSeekAhead = false }: AdapterSetCurrentTimeOptions = {}
  ) {
    this.post({ func: 'seekTo', args: [seconds, !!allowSeekAhead] });
  }

  setVolume(volume: number) {
    this.post({ func: 'setVolume', args: [volume] });
  }

  unmute() {
    this.post({ func: 'unMute' });
  }

  protected createApi(): Promise<void> {
    const { el, uid, url } = this;
    let pollInterval = 0;

    const pollCallback = () => {
      this.postNative({ event: 'listening', id: this.uid });
    };

    const startPolling = () => {
      pollInterval = setInterval(pollCallback, 100);
      pollCallback();

      this.listeners.push(
        on(window, 'message', this.onMessage, { scope: this })
      );
    };

    if (!url.getParam('enablejsapi')) {
      once(el, 'load', startPolling);
      this.url = url.setParam('enablejsapi', '1');
    } else {
      startPolling();
    }

    this.listeners.push(() => clearInterval(pollInterval));

    return new Promise((resolve) => {
      this.awaitMessage(
        ({ event, id }) => parseInt(id) == uid && event === 'onReady'
      ).then(() => {
        clearInterval(pollInterval);
        resolve();
      });
    });
  }

  protected onInitialDelivery(info: YouTubeStateInfo) {
    this.info = info;

    trigger(this.el, videoTimeEvent, <VideoTimerEventArgs>{
      currentTime: info.currentTime,
      duration: info.duration,
    });
  }

  protected onInfoDelivery(changed: Partial<YouTubeStateInfo>) {
    const info = this.info || (this.info = {} as any);
    Object.assign(info, changed);

    if (changed.currentTime || changed.duration) {
      trigger(this.el, videoTimeEvent, <VideoTimerEventArgs>{
        currentTime: info.currentTime,
        duration: info.duration,
      });
    }
  }

  protected onMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      if (data.id !== this.uid) {
        return;
      }

      const { event: type } = data;
      if (type === 'initialDelivery') {
        this.onInitialDelivery(data.info);
      } else if (type === 'infoDelivery') {
        this.onInfoDelivery(data.info);
      }
    } catch (error) {
      // Unreadable message
    }
  }
}
