export interface Transition {
  (from?: HTMLElement | null, to?: HTMLElement | null): Promise<void>;
}
