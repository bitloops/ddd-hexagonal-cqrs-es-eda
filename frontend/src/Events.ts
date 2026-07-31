import { EventEmitter } from 'eventemitter3';
import { type User } from './models/User';
import type { TodoLifecycleEvent } from './infra/mappers/TodoMapper';

export const Events = {
  // Auth events
  AUTH_CHANGED: 'AUTH_CHANGED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',

  // Todo events
  TODO_EVENT: 'TODO_EVENT',

  // SSE events
  SSE_CONNECTION_ESTABLISHED: 'SSE_CONNECTION_ESTABLISHED',
  SSE_CONNECTION_ERROR: 'SSE_CONNECTION_ERROR',
  SSE_CONNECTION_CLOSED: 'SSE_CONNECTION_CLOSED',

  // UI events
  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST',
} as const;

type EventMap = {
  [Events.AUTH_CHANGED]: User | null;
  [Events.LOGIN_SUCCESS]: User;
  [Events.LOGOUT]: null;
  [Events.TODO_EVENT]: TodoLifecycleEvent;
  [Events.SSE_CONNECTION_ESTABLISHED]: null;
  [Events.SSE_CONNECTION_ERROR]: { message: string };
  [Events.SSE_CONNECTION_CLOSED]: null;
  [Events.SHOW_TOAST]: { message: string; type?: 'success' | 'error' | 'info' | 'warning' };
  [Events.HIDE_TOAST]: null;
};

class EventBus {
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
