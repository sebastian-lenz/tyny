export interface Transition {
  (from?: HTMLElement, to?: HTMLElement): Promise<void>;
}
