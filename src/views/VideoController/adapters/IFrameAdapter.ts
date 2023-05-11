import { once } from '../../../utils/dom/event';
import { Url } from '../../../utils/types/Url';
import { Adapter } from './Adapter';

export abstract class IFrameAdapter extends Adapter<HTMLIFrameElement> {
  protected apiPromise: Promise<void> | null = null;
  protected listeners: Array<Function> = [];

  get url(): Url {
    return new Url(this.el.src);
  }

  set url(value: Url) {
    this.el.src = value.toString();
  }

  destroy(): void {
    const { listeners } = this;
    listeners.forEach((listener) => listener());
    listeners.length = 0;
  }

  enableApi(): Promise<void> {
    if (this.apiPromise) {
      return this.apiPromise;
    }

    return (this.apiPromise = this.createApi());
  }

  // Abstract methods
  // ----------------

  protected abstract createApi(): Promise<void>;

  // Protected methods
  // -----------------

  protected awaitMessage(callback: (data: any) => boolean) {
    return new Promise((resolve) => {
      const onMessage = (event: MessageEvent) => {
        resolve(event.data);
        this.listeners = this.listeners.filter((value) => value !== listener);
      };

      const condition = ({ data }: MessageEvent) => {
        try {
          data = JSON.parse(data);
          return data && callback(data);
        } catch (e) {
          // Unreadable message
        }
      };

      const listener = once(window, 'message', onMessage, { condition });
      this.listeners.push(listener);
    });
  }

  protected post(cmd: any) {
    this.enableApi().then(() => {
      this.postNative(cmd);
    });
  }

  protected postNative(cmd: any) {
    const { contentWindow } = this.el;
    if (!contentWindow) {
      return;
    }

    try {
      contentWindow.postMessage(
        JSON.stringify({ event: 'command', ...cmd }),
        '*'
      );
    } catch (e) {}
  }
}
