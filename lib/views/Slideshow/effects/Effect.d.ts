export declare abstract class Effect {
    from: HTMLElement | null;
    to: HTMLElement | null;
    value: number;
    apply(from: HTMLElement | null, to: HTMLElement | null, value: number): void;
    clear(): void;
    protected applyFrom(element: HTMLElement, value: number): void;
    protected applyTo(element: HTMLElement, value: number): void;
    protected bindElement(element: HTMLElement): void;
    protected unbindElement(element: HTMLElement): void;
    protected clearElement(element: HTMLElement): void;
}
