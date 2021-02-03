import { Url } from '../../../utils/types/Url';
import { Adapter } from './Adapter';
export declare abstract class IFrameAdapter extends Adapter<HTMLIFrameElement> {
    protected apiPromise: Promise<void> | null;
    get url(): Url;
    set url(value: Url);
    enableApi(): Promise<void>;
    protected abstract createApi(): Promise<void>;
    protected awaitMessage(callback: (data: any) => boolean): Promise<unknown>;
    protected post(cmd: any): void;
    protected postNative(cmd: any): void;
}
