export type UpdateMode = 'read' | 'write';

export interface UpdateOptions {
  events?: string[] | string;
  mode?: UpdateMode;
}

export interface UpdateHandler {
  events: string[];
  handler: string;
  mode: UpdateMode;
}

export function update({
  events = 'update',
  mode = 'write',
}: UpdateOptions = {}): MethodDecorator {
  return function (target: any, name: any) {
    const updates: tyny.Map<UpdateHandler> = target.hasOwnProperty('_updates')
      ? target._updates
      : (target._updates = { ...target._updates });

    updates[name] = {
      events: typeof events === 'string' ? [events] : events,
      handler: name,
      mode,
    };
  };
}
