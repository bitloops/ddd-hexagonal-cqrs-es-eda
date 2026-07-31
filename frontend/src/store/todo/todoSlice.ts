import { createAsyncThunk } from '@reduxjs/toolkit';

import { EventBus, Events } from '../../Events';
import TodoRepository from '../../infra/repositories/todo';
import todoReducer, { setTodoIds, setTodos, updateTodoTitle } from './todoReducer';

const todoRepository = new TodoRepository();
let isSubscribedToTodoEvents = false;

export const initTodos = createAsyncThunk<void, void, { rejectValue: string }>(
  'todo/initTodos',
  async (_, { dispatch, rejectWithValue }) => {
    if (!isSubscribedToTodoEvents) {
      EventBus.subscribe(
        Events.TODO_EVENT,
        (todoEvent) => {
          switch (todoEvent.eventName) {
            case 'onAdded':
              dispatch(setTodos({ type: 'onAdded', todos: [todoEvent.payload] }));
              break;
            case 'onDeleted':
              dispatch(setTodos({ type: 'onDeleted', todos: [todoEvent.payload] }));
              break;
            case 'onModifiedTitle':
              dispatch(setTodos({ type: 'onModifiedTitle', todos: [todoEvent.payload] }));
              break;
            case 'onCompleted':
              dispatch(setTodos({ type: 'onCompleted', todos: [todoEvent.payload] }));
              break;
            case 'onUncompleted':
              dispatch(setTodos({ type: 'onUncompleted', todos: [todoEvent.payload] }));
              break;
            default:
              break;
          }
        }
      );
      isSubscribedToTodoEvents = true;
    }

    try {
      const response = await todoRepository.getAllTodo(5, 0);
      if (response.status === 'success' && response.todos) {
        dispatch(setTodos({ type: 'init', todos: response.todos }));
        return;
      }
      return rejectWithValue(response.error ?? 'Unknown error');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const loadMoreTodos = createAsyncThunk<
  void,
  { offset: number; limit: number },
  { rejectValue: string }
>(
  'todo/loadMoreTodos',
  async ({ offset, limit }, { dispatch, rejectWithValue }) => {
    try {
      const response = await todoRepository.getAllTodo(limit, offset);
      if (response.status === 'success' && response.todos) {
        dispatch(setTodos({ type: 'onAdded', todos: response.todos }));
        return;
      }
      return rejectWithValue(response.error ?? 'Unknown error');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const addTodo = createAsyncThunk<void, string>('todo/addTodo', async (title) => {
  await todoRepository.addTodo(title);
});

export const deleteTodo = createAsyncThunk<void, string>('todo/deleteTodo', async (id) => {
  await todoRepository.deleteTodo(id);
});

export const modifyTodoTitle = createAsyncThunk<void, { id: string; title: string }>(
  'todo/modifyTodoTitle',
  async ({ id, title }) => {
    await todoRepository.modifyTodoTitle(id, title);
  }
);

export const completeTodo = createAsyncThunk<void, string>('todo/completeTodo', async (id) => {
  await todoRepository.completeTodo(id);
});

export const uncompleteTodo = createAsyncThunk<void, string>(
  'todo/uncompleteTodo',
  async (id) => {
    await todoRepository.uncompleteTodo(id);
  }
);

export { setTodoIds, setTodos, updateTodoTitle };
export default todoReducer;
