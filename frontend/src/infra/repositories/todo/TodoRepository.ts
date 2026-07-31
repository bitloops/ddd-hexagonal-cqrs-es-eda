import {
  todoControllerAddTodo,
  todoControllerGetAll,
  todoControllerModifyTitle,
  todoControllerCompleteTodo,
  todoControllerUncompleteTodo,
  todoControllerDeleteTodo,
} from '../../../api/sdk.gen';
import { type User } from '../../../models/User';
import { EventBus, Events } from '../../../Events';
import { type GetAllTodoResponse, type ITodoRepository } from '../../interfaces/ITodoRepository';
import {
  mapExternalTodo,
  mapExternalTodoLifecycleEvent,
} from '../../mappers/TodoMapper';

import { client } from '../../../api/client.gen';
import { TODO_URL } from '../../../config';
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
      todoSSEClient.setAccessToken(user.accessToken);

      // Initialize SSE connection
      this.initializeSSEConnection();

      // Update API client configuration
      client.setConfig({
        baseUrl: TODO_URL,
        headers: {
          authorization: `Bearer ${user.accessToken}`,
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
          const externalEvent: unknown = JSON.parse(event.data);
          console.log('SSE event received:', event, externalEvent);

          const todoEvent = mapExternalTodoLifecycleEvent(externalEvent);
          if (todoEvent) {
            EventBus.emit(Events.TODO_EVENT, todoEvent);
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

  async getAllTodo(limit: number, offset: number): Promise<GetAllTodoResponse> {
    try {
      const response = await todoControllerGetAll({ query: { limit, offset } });
      return {
        status: 'success',
        todos: response.data?.todos?.map(mapExternalTodo) ?? [],
        error: undefined,
      };
    } catch (error) {
      return {
        status: 'error',
        todos: undefined,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export default TodoRepository;
