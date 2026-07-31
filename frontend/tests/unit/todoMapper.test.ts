import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  mapExternalTodo,
  mapExternalTodoLifecycleEvent,
} from '../../src/infra/mappers/TodoMapper';

describe('Todo anti-corruption mapping', () => {
  it('translates the backend completed field into the UI isCompleted field', () => {
    assert.deepEqual(
      mapExternalTodo({ id: 'todo-1', title: 'Modernise me', completed: true }),
      { id: 'todo-1', title: 'Modernise me', isCompleted: true }
    );
  });

  it('uses the same translation for todo.added SSE events', () => {
    assert.deepEqual(
      mapExternalTodoLifecycleEvent({
        event: 'todo.added',
        data: { id: 'todo-2', title: 'Streamed todo', completed: false, userId: 'user-1' },
      }),
      {
        eventName: 'onAdded',
        payload: { id: 'todo-2', title: 'Streamed todo', isCompleted: false },
      }
    );
  });

  it('keeps completion lifecycle events honest when the backend sends only an id', () => {
    assert.deepEqual(
      mapExternalTodoLifecycleEvent({
        event: 'todo.completed',
        data: { id: 'todo-3', userId: 'user-1' },
      }),
      { eventName: 'onCompleted', payload: { id: 'todo-3' } }
    );
  });

  it('rejects malformed full todo payloads at the boundary', () => {
    assert.throws(
      () => mapExternalTodo({ id: 'todo-4', title: 'Invalid', completed: 'yes' }),
      /completed must be a boolean/
    );
  });
});
