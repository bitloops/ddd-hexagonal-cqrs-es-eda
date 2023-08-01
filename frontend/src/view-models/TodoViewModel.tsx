import { createContext, useContext, useMemo } from 'react';
import { SetterOrUpdater, useRecoilValue } from 'recoil';
import { useTodoRepository } from '../context/DI';
import Todo from '../models/Todo';
import { EventBus, Events } from '../Events';
import { todoIdsState, todosState } from '../state/todos';
import { GetAllTodoResponse, ITodoRepository } from '../infra/interfaces/ITodoRepository';

interface ITodoViewModel {
  init: () => void;
  completeTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  modifyTitle: (id: string, title: string) => void;
  uncompleteTodo: (id: string) => void;
  setSetters: (setTodo: (todo: Todo) => void, setTodoIds: SetterOrUpdater<string[]>) => void;
  setGetters: (getTodo: (id: string) => Todo | null, getTodoIds: () => string[]) => void;
  setTodo: (todo: Todo) => void;
  useTodoSelectors: () => {
    todoIds: string[];
    useTodo: (id: string) => Todo | null;
  };
}

class TodoViewModel implements ITodoViewModel {
  private setters: {
    setTodo: ((todo: Todo) => void) | null;
    setTodoIds: SetterOrUpdater<string[]> | null;
  } = { setTodo: null, setTodoIds: null };

  private getters: {
    getTodo: ((id: string) => Todo | null) | null;
    getTodoIds: (() => string[]) | null;
  } = { getTodo: null, getTodoIds: null };

  private initialized = false;

  constructor(private todoRepository: ITodoRepository) {
    console.debug('TodoViewModel constructor', todoRepository);
  }

  init() {
    EventBus.subscribe(Events.TODO_EVENT, this.onTodoEvent);
    this.fetchAllTodo();
  }

  private onTodoEvent = (data: { eventName: string; payload: unknown }) => {
    console.log('onTodoEvent', data);
    const { eventName, payload } = data;
    if (payload) {
      let todo: Todo | null = null;
      switch (eventName) {
        case 'onAdded':
          if (this.getTodoIds()?.filter((id) => id === (payload as Todo).id).length === 0) {
            this.setTodoIds([...this.getTodoIds(), (payload as Todo).id]);
            this.setTodo(payload as Todo);
          }
          break;
        case 'onDeleted':
          console.log('onDeleted');
          this.setTodoIds(this.getTodoIds()?.filter((todoId) => todoId !== (payload as Todo).id));
          // TODO remove atom from todo family
          break;
        case 'onModifiedTitle':
          console.log('onModifiedTitle');
          todo = this.getTodo((payload as Todo).id);
          if (todo !== null && this.setTodo) {
            this.setTodo({ ...todo, title: (payload as Todo).title });
          }
          break;
        case 'onCompleted':
          console.log('onCompleted');
          todo = this.getTodo((payload as Todo).id);
          if (todo !== null) {
            this.setTodo({ ...todo, isCompleted: true });
          }
          break;
        case 'onUncompleted':
          console.log('onUncompleted');
          todo = this.getTodo((payload as Todo).id);
          if (todo !== null) {
            this.setTodo({ ...todo, isCompleted: false });
          }
          break;
        default:
          break;
      }
    }
  };

  fetchAllTodo = () => {
    console.log('getAllTodos');
    const response = this.todoRepository.getAllTodo(this.allTodoFetched);
    this.allTodoFetched(response);
  };

  private allTodoFetched = (asyncResponse: GetAllTodoResponse) => {
    console.log('privateAllTodoFetched', asyncResponse);
    const todoIds = asyncResponse.todos?.map((todo: Todo) => {
      // use the `setTodoItem` callback to update each todo item
      this.setTodo(todo);
      return todo.id;
    });
    if (todoIds) {
      this.setTodoIds(todoIds);
    }
  };

  setSetters = (setTodo: (todo: Todo) => void, setTodoIds: SetterOrUpdater<string[]>) => {
    this.setters.setTodo = setTodo;
    this.setters.setTodoIds = setTodoIds;
  };

  setGetters = (getTodo: (id: string) => Todo | null, getTodoIds: () => string[]) => {
    this.getters.getTodo = getTodo;
    this.getters.getTodoIds = getTodoIds;
  };

  modifyTitle = (id: string, title: string) => {
    const todo = this.getTodo(id);
    console.log('modifyTitle', id, title, todo);
    if (todo === null) return;
    this.todoRepository.modifyTodoTitle(id, title).catch(() => {
      // TODO show error message
    });
  };

  completeTodo = (id: string) => {
    console.log('completeTodo', id);
    this.todoRepository.completeTodo(id);
  };

  uncompleteTodo = (id: string) => {
    console.log('uncompleteTodo', id);
    this.todoRepository.uncompleteTodo(id);
  };

  deleteTodo = (id: string) => {
    console.log('deleteTodo', id);
    this.todoRepository.deleteTodo(id);
  };

  addTodo = (title: string) => {
    console.log('addTodo', title);
    this.todoRepository.addTodo(title);
  };

  useTodoSelectors = () => ({
    todoIds: useRecoilValue(todoIdsState),
    useTodo: (id: string) => useRecoilValue(todosState(id)),
  });

  private setTodoIds = (todoIds: string[]) => {
    if (this.setters.setTodoIds) this.setters.setTodoIds(todoIds);
    else throw new Error('setTodoIds is not set');
  };

  setTodo = (todo: Todo) => {
    if (this.setters.setTodo) this.setters.setTodo(todo);
    else throw new Error('setTodo is not set');
  };

  private getTodoIds = (): string[] => {
    if (this.getters.getTodoIds) return this.getters.getTodoIds();
    throw new Error('getTodoIds is not set');
  };

  private getTodo = (id: string): Todo | null => {
    if (this.getters.getTodo) return this.getters.getTodo(id);
    throw new Error('getTodo is not set');
  };
}

const TodoViewModelContext = createContext<TodoViewModel | null>(null);

export interface TodoViewModelProviderProps {
  children: React.ReactNode;
}

const TodoViewModelProvider: React.FC<TodoViewModelProviderProps> = ({
  children,
}: TodoViewModelProviderProps) => {
  const todoRepository = useTodoRepository();
  const todoViewModel = useMemo(() => new TodoViewModel(todoRepository), [todoRepository]);

  return (
    <TodoViewModelContext.Provider value={todoViewModel}>{children}</TodoViewModelContext.Provider>
  );
};

const useTodoViewModel = () => {
  const viewModel = useContext(TodoViewModelContext);
  if (!viewModel) throw new Error('No TodoViewModel provided');
  return viewModel;
};

export { TodoViewModel, TodoViewModelProvider, TodoViewModelContext, useTodoViewModel };
