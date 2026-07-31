import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TodoIdentifier, TodoTitleUpdate } from '../../infra/mappers/TodoMapper';
import type { Todo } from '../../models/Todo';

interface TodoState {
  todosState: Todo[];
  todoIdsState: string[];
}

const initialState: TodoState = {
  todosState: [],
  todoIdsState: [],
};

type TodoStateChange =
  | { type: 'init' | 'onAdded'; todos: Todo[] }
  | { type: 'onDeleted' | 'onCompleted' | 'onUncompleted'; todos: TodoIdentifier[] }
  | { type: 'onModifiedTitle'; todos: TodoTitleUpdate[] };

// Keep accepting the original full-Todo action shape while callers migrate to
// the narrower lifecycle payloads above.
export type SetTodosPayload = TodoStateChange | { type: string; todos: Todo[] };

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTodos(state, action: PayloadAction<SetTodosPayload>) {
      const { type, todos } = action.payload;

      switch (type) {
        case 'init':
          state.todosState = todos;
          state.todoIdsState = todos.map((todo) => todo.id);
          break;
        case 'onAdded':
          state.todosState = Array.from(new Set([...state.todosState, ...todos]));
          state.todoIdsState = Array.from(
            new Set([...state.todoIdsState, ...todos.map((todo) => todo.id)])
          );
          break;
        case 'onDeleted':
          state.todosState = state.todosState.filter((todo) => todo.id !== todos[0]?.id);
          state.todoIdsState = state.todoIdsState.filter((id) => id !== todos[0]?.id);
          break;
        case 'onCompleted':
          state.todosState = state.todosState.map((todo) =>
            todo.id === todos[0]?.id ? { ...todo, isCompleted: true } : todo
          );
          break;
        case 'onUncompleted':
          state.todosState = state.todosState.map((todo) =>
            todo.id === todos[0]?.id ? { ...todo, isCompleted: false } : todo
          );
          break;
        case 'onModifiedTitle':
          state.todosState = state.todosState.map((todo) =>
            todo.id === todos[0]?.id ? { ...todo, title: todos[0]?.title ?? todo.title } : todo
          );
          break;
        default:
          break;
      }
    },
    setTodoIds(state, action: PayloadAction<string[]>) {
      state.todoIdsState = action.payload;
    },
    updateTodoTitle(state, action: PayloadAction<{ id: string; title: string }>) {
      const { id, title } = action.payload;
      state.todosState = state.todosState.map((todo) =>
        todo.id === id ? { ...todo, title } : todo
      );
    },
  },
});

export const { setTodos, setTodoIds, updateTodoTitle } = todoSlice.actions;
export default todoSlice.reducer;
