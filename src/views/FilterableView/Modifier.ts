import type { Url } from '../../utils/types/Url';

export interface Modifier {
  getParams(): tyny.Map<string | null>;
  softReset(): void;
  sync(url: Url): boolean;
}
