import type { Todo } from '../../models/Todo';

export type TodoIdentifier = Pick<Todo, 'id'>;
export type TodoTitleUpdate = Pick<Todo, 'id' | 'title'>;

export type TodoLifecycleEvent =
  | { eventName: 'onAdded'; payload: Todo }
  | { eventName: 'onDeleted'; payload: TodoIdentifier }
  | { eventName: 'onModifiedTitle'; payload: TodoTitleUpdate }
  | { eventName: 'onCompleted'; payload: TodoIdentifier }
  | { eventName: 'onUncompleted'; payload: TodoIdentifier };

function asRecord(value: unknown, description: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`Invalid ${description}`);
  }
  return value as Record<string, unknown>;
}

function requiredString(
  value: Record<string, unknown>,
  property: string,
  description: string
): string {
  const result = value[property];
  if (typeof result !== 'string') {
    throw new Error(`Invalid ${description}: ${property} must be a string`);
  }
  return result;
}

export function mapExternalTodo(value: unknown): Todo {
  const externalTodo = asRecord(value, 'todo payload');
  const completed = externalTodo.completed;
  if (typeof completed !== 'boolean') {
    throw new Error('Invalid todo payload: completed must be a boolean');
  }

  return {
    id: requiredString(externalTodo, 'id', 'todo payload'),
    title: requiredString(externalTodo, 'title', 'todo payload'),
    isCompleted: completed,
  };
}

function mapTodoIdentifier(value: unknown): TodoIdentifier {
  const payload = asRecord(value, 'todo lifecycle payload');
  return { id: requiredString(payload, 'id', 'todo lifecycle payload') };
}

function mapTodoTitleUpdate(value: unknown): TodoTitleUpdate {
  const payload = asRecord(value, 'todo title update payload');
  return {
    id: requiredString(payload, 'id', 'todo title update payload'),
    title: requiredString(payload, 'title', 'todo title update payload'),
  };
}

export function mapExternalTodoLifecycleEvent(value: unknown): TodoLifecycleEvent | null {
  const envelope = asRecord(value, 'todo event envelope');
  const eventName = envelope.event;

  switch (eventName) {
    case 'todo.added':
      return { eventName: 'onAdded', payload: mapExternalTodo(envelope.data) };
    case 'todo.deleted':
      return { eventName: 'onDeleted', payload: mapTodoIdentifier(envelope.data) };
    case 'todo.modified_title':
      return { eventName: 'onModifiedTitle', payload: mapTodoTitleUpdate(envelope.data) };
    case 'todo.completed':
      return { eventName: 'onCompleted', payload: mapTodoIdentifier(envelope.data) };
    case 'todo.uncompleted':
      return { eventName: 'onUncompleted', payload: mapTodoIdentifier(envelope.data) };
    default:
      return null;
  }
}
