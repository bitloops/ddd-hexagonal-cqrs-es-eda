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
      // Set JWT for SSE client
      todoSSEClient.setJwt(user.jwt);

      // Initialize SSE connection
      this.initializeSSEConnection();

      // Update API client configuration
      client.setConfig({
        baseUrl: TODO_URL,
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

  async getAllTodo(): Promise<GetAllTodoResponse> {
    try {
      const response = await todoControllerGetAll();
      return {
        status: 'success',
        todos: response.data?.todos?.map((todo) => ({
          id: todo.id,
          title: todo.title,
          isCompleted: todo.completed,
        })) ?? [],
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
