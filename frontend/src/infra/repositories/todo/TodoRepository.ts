import {
  todoControllerAddTodo,
  todoControllerGetAll,
  todoControllerModifyTitle,
  todoControllerCompleteTodo,
  todoControllerUncompleteTodo,
  todoControllerDeleteTodo,
} from '../../../api/sdk.gen';
import { TODO_LOCAL_STORAGE_KEY } from '../../../constants';
import Todo from '../../../models/Todo';
import { User } from '../../../models/User';
import LocalStorageRepository from '../../LocalStorage';
import { EventBus, Events } from '../../../Events';
import { GetAllTodoResponse, ITodoRepository } from '../../interfaces/ITodoRepository';

import { client } from '../../../api/client.gen';
import { PROXY_URL } from '../../../config';
import { todoSSEClient } from '../../services/SSEClient';

class TodoRepository implements ITodoRepository {
  private user: User | null = null;

  private sseConnected = false;

  constructor() {
    EventBus.subscribe(Events.AUTH_CHANGED, this.onAuthChanged);
  }

  private onAuthChanged = (user: User | null): void => {
    console.log('[TodoRepository] onAuthChanged event received', user, this.user);
    this.user = user;

    if (user) {
      // Set JWT for SSE client
      todoSSEClient.setJwt(user.jwt);

      // Initialize SSE connection
      this.initializeSSEConnection();

      // Update API client configuration
      client.setConfig({
        baseUrl: PROXY_URL,
        headers: {
          authorization: `Bearer ${user.jwt}`,
        },
      });
    } else {
      // Disconnect SSE on logout
      todoSSEClient.disconnect();
      this.sseConnected = false;
    }
  };

  private initializeSSEConnection(): void {
    if (this.sseConnected || !this.user) return;

    todoSSEClient.connect({
      onOpen: () => {
        console.log('SSE connection established');
        this.sseConnected = true;
      },
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('SSE event received:', event, data);

          if (data.event) {
            // Map SSE events to the same format as before for compatibility
            const eventMap: Record<string, string> = {
              'todo.added': 'onAdded',
              'todo.deleted': 'onDeleted',
              'todo.modified_title': 'onModifiedTitle',
              'todo.completed': 'onCompleted',
              'todo.uncompleted': 'onUncompleted',
            };

            if (eventMap[data.event]) {
              EventBus.emit(Events.TODO_EVENT, {
                eventName: eventMap[data.event],
                payload: data.data,
              });
            }
          }
        } catch (error) {
          console.error('Error processing SSE message:', error, event.data);
        }
      },
      onError: (error) => {
        console.error('SSE connection error:', error);
        this.sseConnected = false;
      },
    });
  }

  async addTodo(title: string): Promise<void> {
    // const token = LocalStorageRepository.getAccessToken();
    const response = await todoControllerAddTodo({ body: { title } });
    if (response.error) {
      throw new Error((response as { error: string }).error);
    }
  }

  async modifyTodoTitle(id: string, title: string): Promise<void> {
    const response = await todoControllerModifyTitle({ path: { id }, body: { id, title } });
    if (response.error) {
      throw new Error((response as { error: string }).error);
    }
  }

  async completeTodo(id: string): Promise<void> {
    const response = await todoControllerCompleteTodo({ path: { id } });
    if (response.error) {
      throw new Error((response as { error: string }).error);
    }
  }

  async uncompleteTodo(id: string): Promise<void> {
    const response = await todoControllerUncompleteTodo({ path: { id } });
    if (response.error) {
      throw new Error((response as { error: string }).error);
    }
  }

  async deleteTodo(id: string): Promise<void> {
    const response = await todoControllerDeleteTodo({ path: { id } });
    if (response.error) {
      throw new Error((response as { error: string }).error);
    }
  }

  getAllTodo(callback: (asyncResponse: GetAllTodoResponse) => void): GetAllTodoResponse {
    const localTodos =
      LocalStorageRepository.getLocalStorageObject<Todo[]>(TODO_LOCAL_STORAGE_KEY) ?? [];
    todoControllerGetAll()
      .then((response) => {
        callback({
          status: 'success',
          todos:
            response.data?.todos?.map((todo) => ({
              id: todo.id,
              title: todo.title,
              isCompleted: todo.completed,
            })) ?? [],
          error: undefined,
        });
      })
      .catch((error) => {
        callback({
          status: 'error',
          todos: undefined,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });
    return {
      status: 'cached',
      todos: localTodos,
      error: undefined,
    };
  }
}

export default TodoRepository;
