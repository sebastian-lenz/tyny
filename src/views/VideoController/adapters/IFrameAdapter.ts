import { once } from '../../../utils/dom/event';
import { Url } from '../../../utils/types/Url';
import { Adapter } from './Adapter';

export abstract class IFrameAdapter extends Adapter<HTMLIFrameElement> {
  protected apiPromise: Promise<void> | null = null;

  get url(): Url {
    return new Url(this.el.src);
  }

  set url(value: Url) {
    this.el.src = value.toString();
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
    return new Promise((resolve) =>
      once(window, 'message', (event: MessageEvent) => resolve(event.data), {
        condition: ({ data }: MessageEvent) => {
          try {
            data = JSON.parse(data);
            return data && callback(data);
          } catch (e) {
            // Unreadable message
          }
        },
      })
    );
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
