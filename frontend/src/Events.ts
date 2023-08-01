import { EventEmitter } from 'eventemitter3';
import { User } from './models/User';

export enum Events {
  AUTH_CHANGED = 'AUTH_CHANGED',
  TODO_EVENT = 'TODO_EVENT',
}

type EventMap = {
  [Events.AUTH_CHANGED]: User | null;
  [Events.TODO_EVENT]: { eventName: string; payload: unknown };
};

class EventBus {
  // eslint-disable-next-line no-use-before-define
  private static _instance: EventBus;

  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
  }

  public static get instance(): EventBus {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
    }
    return EventBus._instance;
  }

  public subscribe<T extends keyof EventMap>(
    event: T,
    listener: (payload: EventMap[T]) => void
  ): void {
    console.log('Got a subscriber', event);
    this.emitter.on(event, listener);
  }

  public emit<T extends keyof EventMap>(event: T, payload: EventMap[T]): void {
    console.log('Emitted an event', event, payload);
    this.emitter.emit(event, payload);
  }

  public unsubscribe<T extends keyof EventMap>(
    event: T,
    listener: (payload: EventMap[T]) => void
  ): void {
    this.emitter.off(event, listener);
  }
}

export const eventBus = EventBus.instance;

export { eventBus as EventBus };
