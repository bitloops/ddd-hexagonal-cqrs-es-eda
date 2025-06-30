import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Todo } from '../../models/Todo';
import TodoRepository from '../../infra/repositories/todo';
import { EventBus, Events } from '../../Events';

interface TodoState {
    todosState: Todo[];
    todoIdsState: string[];
}

const initialState: TodoState = {
    todosState: [],
    todoIdsState: [],
};

const todoRepository = new TodoRepository();

export const initTodos = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    'todo/initTodos',
    async (_, { dispatch, rejectWithValue }) => {
        // Subscribe to SSE events only once
        EventBus.subscribe(Events.TODO_EVENT, (data: { eventName: string; payload: unknown }) => {
            const { eventName, payload } = data;
            switch (eventName) {
                case 'onAdded': {
                    dispatch(setTodos({ type: 'onAdded', todos: [payload as Todo] }));
                    break;
                }
                case 'onDeleted':
                    dispatch(setTodos({ type: 'onDeleted', todos: [payload as Todo] }));
                    break;
                case 'onModifiedTitle':
                    dispatch(setTodos({ type: 'onModifiedTitle', todos: [payload as Todo] }));
                    break;
                case 'onCompleted':
                    dispatch(setTodos({ type: 'onCompleted', todos: [payload as Todo] }));
                    break;
                case 'onUncompleted':
                    dispatch(setTodos({ type: 'onUncompleted', todos: [payload as Todo] }));
                    break;
                default:
                    break;
            }
        });

        // Fetch all todos
        try {
            const todoRepository = new TodoRepository();
            const response = await todoRepository.getAllTodo(5, 0); //Getting only 5 todos on page load
            if (response.status === 'success' && response.todos) {
                dispatch(setTodos({ type: 'init', todos: response.todos }));
            } else {
                return rejectWithValue(response.error ?? 'Unknown error');
            }
        } catch (error) {
            const message = (error as Error).message;
            return rejectWithValue(message);
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
            const todoRepository = new TodoRepository();
            const response = await todoRepository.getAllTodo(limit, offset);
            if (response.status === 'success' && response.todos) {
                dispatch(setTodos({ type: 'onAdded', todos: response.todos }))
            } else {
                return rejectWithValue(response.error ?? 'Unknown error');
            }
        } catch (error) {
            const message = (error as Error).message;
            return rejectWithValue(message);
        }
    }
);

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setTodos(state, action: PayloadAction<{ type: string, todos: Todo[] }>) {
            const { type, todos } = action.payload;

            switch (type) {
                case 'init':
                    state.todosState = todos;
                    state.todoIdsState = todos.map(todo => todo.id);
                    break;
                case 'onAdded':
                    state.todosState = Array.from(new Set([...state.todosState, ...todos]));
                    state.todoIdsState = Array.from(new Set([...state.todoIdsState, ...todos.map(todo => todo.id)]));
                    break;
                case 'onDeleted':
                    state.todosState = state.todosState.filter(todo => todo.id !== todos[0].id);
                    state.todoIdsState = state.todoIdsState.filter(id => id !== todos[0].id);
                    break;
                case 'onCompleted':
                    state.todosState = state.todosState.map(todo => {
                        if (todo.id === todos[0].id) {
                            return { ...todo, completed: true };
                        }
                        return todo;
                    });
                    break;
                case 'onUncompleted':
                    state.todosState = state.todosState.map(todo => {
                        if (todo.id === todos[0].id) {
                            return { ...todo, completed: false };
                        }
                        return todo;
                    });
                    break;
                case 'onModifiedTitle':
                    state.todosState = state.todosState.map(todo => {
                        if (todo.id === todos[0].id) {
                            return { ...todo, title: todos[0].title };
                        }
                        return todo;
                    });
                    break;
                default:
                    break;
            }
        },
        setTodoIds(state, action: PayloadAction<string[]>) {
            state.todoIdsState = action.payload;
        },
        addTodo(_state, action: PayloadAction<string>) {
            const title = action.payload;
            todoRepository.addTodo(title)
        },
        deleteTodo(_state, action: PayloadAction<string>) {
            const id = action.payload;
            todoRepository.deleteTodo(id);
        },
        modifyTodoTitle(_state, action: PayloadAction<{ id: string, title: string }>) {
            const { id, title } = action.payload;
            todoRepository.modifyTodoTitle(id, title);
        },
        completeTodo(_state, action: PayloadAction<string>) {
            const id = action.payload;
            todoRepository.completeTodo(id);
        },
        uncompleteTodo(_state, action: PayloadAction<string>) {
            const id = action.payload;
            todoRepository.uncompleteTodo(id)

        },
        updateTodoTitle(state, action: PayloadAction<{ id: string, title: string }>) {
            const { id, title } = action.payload;
            state.todosState = state.todosState.map(todo => {
                if (todo.id === id) {
                    return { ...todo, title };
                }
                return todo;
            });
        }

    },
});

export const {
    setTodos,
    setTodoIds,
    addTodo,
    deleteTodo,
    modifyTodoTitle,
    completeTodo,
    uncompleteTodo,
    updateTodoTitle
} = todoSlice.actions;

export default todoSlice.reducer;