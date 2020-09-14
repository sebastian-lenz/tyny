export type AnimationPlayState = 'playing' | 'stopped' | 'finished';

export interface Animation<T> extends Promise<T> {
  stop(): void;
}

/**
 * Timing function type declaration.
 */
export interface EasingFunction {
  (time: number, base: number, change: number, duration: number): number;
  toCSS(): string;
}
