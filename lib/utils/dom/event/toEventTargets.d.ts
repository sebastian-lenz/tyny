export type EventTargetLike = EventTarget | HTMLCollection | Node | NodeList | undefined | null | string;
export declare function toEventTargets(target: EventTargetLike | Array<EventTargetLike>): Array<EventTarget>;
