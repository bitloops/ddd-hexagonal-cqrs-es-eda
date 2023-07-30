import { createContext, useContext, useMemo } from 'react';
import { SetterOrUpdater } from 'recoil';
import { GetAllTodoResponse, ITodoRepository } from '../infra/repositories/todo';
import { useTodoRepository } from '../context/DI';
import Todo from '../models/Todo';
import { EventBus, Events } from '../Events';

interface ITodoViewModel {
  todoIds: string[];
  todo: (id: string) => Todo | null;
  modifyTitle: (id: string, title: string) => void;
  completeTodo: (id: string) => void;
  uncompleteTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

class TodoViewModel implements ITodoViewModel {
  private fetchTodoCallback: ((response: GetAllTodoResponse) => void) | null = null;

  private initialized = false;

  private setters: {
    setTodoIds: SetterOrUpdater<string[]> | null;
    setTodoItem: ((todo: Todo) => void) | null;
  } = { setTodoIds: null, setTodoItem: null };

  private getters: {
    getTodoIds: (() => string[]) | null;
    getTodoItem: ((id: string) => Todo | null) | null;
  } = { getTodoIds: null, getTodoItem: null };

  constructor(private todoRepository: ITodoRepository) {
    console.log('TodoViewModel constructor', todoRepository);
    EventBus.subscribe(Events.TODO_EVENT, this.onTodoEvent);
  }

  private onTodoEvent = (data: { eventName: string; payload: unknown }) => {
    console.log('onTodoEvent', data);
    const { eventName, payload } = data;
    if (payload)
      switch (eventName) {
        case 'onAdded':
          console.log('onAdded');
          if (this.setters.setTodoIds)
            this.setters.setTodoIds([...this.todoIds, (payload as Todo).id]);
          if (this.setters.setTodoItem) this.setters.setTodoItem(payload as Todo);
          break;
        case 'onDeleted':
          console.log('onDeleted');
          if (this.setters.setTodoIds)
            this.setters.setTodoIds(
              this.todoIds.filter((todoId) => todoId !== (payload as Todo).id)
            );
          // TODO remove atom from todo family
          break;
        case 'onModifiedTitle':
          console.log('onModifiedTitle');
          if (this.getters.getTodoItem) {
            const item = this.getters.getTodoItem((payload as Todo).id);
            if (item !== null && this.setters.setTodoItem)
              this.setters.setTodoItem({ ...item, title: (payload as Todo).title });
          }
          break;
        case 'onCompleted':
          console.log('onCompleted');
          if (this.getters.getTodoItem) {
            const item = this.getters.getTodoItem((payload as Todo).id);
            if (item !== null && this.setters.setTodoItem)
              this.setters.setTodoItem({ ...item, isCompleted: true });
          }
          break;
        case 'onUncompleted':
          console.log('onUncompleted');
          if (this.getters.getTodoItem) {
            const item = this.getters.getTodoItem((payload as Todo).id);
            if (item !== null && this.setters.setTodoItem)
              this.setters.setTodoItem({ ...item, isCompleted: false });
          }
          break;
        default:
          break;
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
      if (this.setters.setTodoItem) this.setters.setTodoItem(todo);
      return todo.id;
    });
    if (todoIds) {
      if (this.setters.setTodoIds) this.setters.setTodoIds(todoIds);
    }
  };

  get todoIds(): string[] {
    if (!this.initialized) {
      this.initialized = true;
      this.fetchAllTodo();
    }
    const ids = this.getters.getTodoIds ? this.getters.getTodoIds() : [];
    return ids;
  }

  todo(id: string): Todo | null {
    const todo = this.getters.getTodoItem ? this.getters.getTodoItem(id) : null;
    return todo;
  }

  setSetters = (setTodoIds: SetterOrUpdater<string[]>, setTodoItem: (todo: Todo) => void) => {
    this.setters.setTodoIds = setTodoIds;
    this.setters.setTodoItem = setTodoItem;
  };

  setGetters = (getTodoIds: () => string[], getTodoItem: (id: string) => Todo | null) => {
    this.getters.getTodoIds = getTodoIds;
    this.getters.getTodoItem = getTodoItem;
  };

  modifyTitle = (id: string, title: string) => {
    const todo = this.getters.getTodoItem ? this.getters.getTodoItem(id) : null;
    if (!todo) return;
    // const backup = { ...todo };
    todo.title = title;
    console.log('modifyTitle', id, title);
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
