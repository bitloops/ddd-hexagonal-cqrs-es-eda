import { ClientReadableStream } from 'grpc-web';
import {
  AddTodoRequest,
  CompleteTodoRequest,
  DeleteTodoRequest,
  GetAllTodosRequest,
  GetAllTodosResponse,
  InitializeConnectionRequest,
  InitializeConnectionResponse,
  KeepSubscriptionAliveRequest,
  KeepSubscriptionAliveResponse,
  ModifyTitleTodoRequest,
  OnEvent,
  OnTodoRequest,
  TODO_EVENTS,
  UncompleteTodoRequest,
  TodoServiceClient,
} from '../../../bitloops/proto/todo';
import { Errors, TODO_LOCAL_STORAGE_KEY } from '../../../constants';
import Todo from '../../../models/Todo';
import { User } from '../../../models/User';
import Helpers from '../../Helpers';
import LocalStorageRepository from '../../LocalStorage';
import { EventBus, Events } from '../../../Events';
import { GetAllTodoResponse, ITodoRepository } from '../../interfaces/ITodoRepository';

class TodoRepository implements ITodoRepository {
  private subscriptionId: string | null = null;

  private user: User | null = null;

  private subscriptionInterval: NodeJS.Timeout | null = null;

  private subscriptionStream: ClientReadableStream<OnEvent> | null = null;

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private todoService: TodoServiceClient) {
    EventBus.subscribe(Events.AUTH_CHANGED, this.onAuthChanged);
  }

  private onAuthChanged = (user: User | null): void => {
    console.log(
      '[TodoRepository] onAuthChanged event received',
      user,
      this.subscriptionId,
      this.subscriptionStream
    );
    this.user = user;
    // this.updateUser(user);
    if (user && (this.subscriptionId === null || this.subscriptionStream === null)) {
      this.initializeSubscriptionConnection();
    } else if (user === null) {
      this.closeSubscriptionConnection();
    }
  };

  private closeSubscriptionConnection(): void {
    if (this.subscriptionStream) {
      this.subscriptionStream.cancel();
      this.subscriptionStream = null;
    }
    if (this.subscriptionInterval) {
      clearInterval(this.subscriptionInterval);
      this.subscriptionInterval = null;
    }
    this.subscriptionId = null;
  }

  private updateUser(user: User | null): void {
    this.user = user;
    EventBus.emit(Events.AUTH_CHANGED, user);
  }

  private keepAlive(): void {
    if (this.subscriptionId !== null) {
      const request = new KeepSubscriptionAliveRequest();
      request.subscriberId = this.subscriptionId;
      this.todoService
        .KeepSubscriptionAlive(request, { authorization: `Bearer ${this.user?.jwt}` })
        .then((response: KeepSubscriptionAliveResponse) => {
          if (response.renewedAuthToken && this.user !== null) {
            this.updateUser({
              ...this.user,
              jwt: response.renewedAuthToken,
            });
          }
        })
        .catch((error) => {
          console.log('(error as any).message', (error as { message: string }).message);
          if ((error as { message: string })?.message === 'Invalid subscription') {
            this.initializeSubscriptionConnection();
          } else {
            console.error(error);
          }
        });
    } else if (this.user) {
      this.initializeSubscriptionConnection();
    }
  }

  private initializeSubscriptionConnection(): void {
    console.log(
      'Initializing Subscription Connection',
      this.subscriptionId,
      !!this.subscriptionInterval
    );
    const connectionRequest = new InitializeConnectionRequest();
    this.todoService
      .InitializeSubscriptionConnection(connectionRequest, {
        authorization: `Bearer ${this.user?.jwt}`,
      })
      .then((response: InitializeConnectionResponse) => {
        this.subscriptionId = response.subscriberId;
        console.log('Subscription ID', this.subscriptionId);
        return this.subscriptionId;
      })
      .then((subscriptionId: string) => {
        if (this.subscriptionInterval === null) {
          const interval = setInterval(() => {
            this.keepAlive();
          }, 10000);
          this.subscriptionInterval = interval;
        }
        const onTodoRequest = new OnTodoRequest();
        onTodoRequest.events = [
          TODO_EVENTS.ADDED,
          TODO_EVENTS.DELETED,
          TODO_EVENTS.MODIFIED_TITLE,
          TODO_EVENTS.COMPLETED,
          TODO_EVENTS.UNCOMPLETED,
        ];
        onTodoRequest.subscriberId = subscriptionId;
        const onStream = this.todoService.On(onTodoRequest, {
          authorization: `Bearer ${this.user?.jwt}`,
        });
        onStream.on('end', () => {
          console.log('Connection was ended');
          if (this.subscriptionInterval) clearInterval(this.subscriptionInterval);
          this.subscriptionId = null;
        });
        onStream.on('data', (dataEvent) => {
          console.log('Data received from server stream', dataEvent);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const eventObject: { [key: string]: any } = dataEvent.toObject();
          const filteredValues = Object.keys(eventObject).filter(
            (key) => eventObject[key] !== undefined
          );
          const eventName = filteredValues[0];
          const payload =
            dataEvent.onAdded ||
            dataEvent.onDeleted ||
            dataEvent.onModifiedTitle ||
            dataEvent.onCompleted ||
            dataEvent.onUncompleted;
          EventBus.emit(Events.TODO_EVENT, { eventName, payload });
          console.log('event', eventName, payload);
        });
        onStream.on('status', (status) => {
          console.log('Received connection status update:', status);
        });
        // onStream.on('metadata', (metadata: grpcWeb.Metadata) => {
        //   console.log('metadata', metadata);
        // });
        onStream.on('error', () => {
          console.log('Server disconnected, trying to reconnect...');
          // console.error(error);
          // if (subscriptionInterval) clearInterval(subscriptionInterval);
          this.subscriptionId = null;
        });
        this.subscriptionStream = onStream;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async addTodo(title: string): Promise<void> {
    const token = LocalStorageRepository.getAccessToken();
    const request = new AddTodoRequest();
    request.title = title;
    this.todoService.Add(request, {
      authorization: `Bearer ${token}`,
    });
  }

  async modifyTodoTitle(id: string, title: string): Promise<void> {
    const token = LocalStorageRepository.getAccessToken();
    const request = new ModifyTitleTodoRequest();
    request.id = id;
    request.title = title;
    this.todoService.ModifyTitle(request, {
      authorization: `Bearer ${token}`,
    });
  }

  async completeTodo(id: string): Promise<void> {
    const token = LocalStorageRepository.getAccessToken();
    const request = new CompleteTodoRequest();
    request.id = id;
    this.todoService.Complete(request, {
      authorization: `Bearer ${token}`,
    });
  }

  async uncompleteTodo(id: string): Promise<void> {
    const token = LocalStorageRepository.getAccessToken();
    const request = new UncompleteTodoRequest();
    request.id = id;
    this.todoService.Uncomplete(request, {
      authorization: `Bearer ${token}`,
    });
  }

  async deleteTodo(id: string): Promise<void> {
    const token = LocalStorageRepository.getAccessToken();
    const request = new DeleteTodoRequest();
    request.id = id;
    this.todoService.Delete(request, {
      authorization: `Bearer ${token}`,
    });
  }

  getAllTodo(callback?: (asyncResponse: GetAllTodoResponse) => void): GetAllTodoResponse {
    const localTodos =
      LocalStorageRepository.getLocalStorageObject<Todo[]>(TODO_LOCAL_STORAGE_KEY) ?? [];
    const token = LocalStorageRepository.getAccessToken();
    // eslint-disable-next-line no-new, no-async-promise-executor
    new Promise<GetAllTodoResponse>(async (resolve) => {
      try {
        const getAllTodoResponse: GetAllTodosResponse = await this.todoService.GetAll(
          new GetAllTodosRequest(),
          {
            authorization: `Bearer ${token}`,
            'cache-hash': await Helpers.sha256Hash(JSON.stringify(localTodos)),
          }
        );
        if (getAllTodoResponse.hasError) {
          const errorResponse = getAllTodoResponse.error;
          if (errorResponse && errorResponse.hasSystemUnavailableError) {
            resolve({
              status: 'error',
              error: 'System unavailable',
              todos: undefined,
            });
          }
          if (errorResponse && errorResponse.hasUnauthorizedError) {
            resolve({
              status: 'error',
              error: 'Unauthorized',
              todos: undefined,
            });
          }
        } else if (getAllTodoResponse.hasOk) {
          const todos: Todo[] =
            getAllTodoResponse.ok?.todos?.map((todoElement) => ({
              id: todoElement.id,
              title: todoElement.title,
              isCompleted: todoElement.completed,
            })) || [];
          resolve({
            status: 'success',
            todos,
            error: undefined,
          });
        }
      } catch (error) {
        // If there error message is CACHE_HIT, it means that the response was
        // cached and we don't need to do anything.
        if ((error as { message: string }).message !== Errors.CACHE_HIT) {
          if ((error as { message: string }).message === Errors.INVALID_JWT) {
            console.log('Invalid JWT token');
            EventBus.emit(Events.AUTH_CHANGED, null);
          }
        }
      }
    }).then((response) => {
      if (callback) {
        callback(response);
      }
    });

    return {
      status: 'cached',
      todos: localTodos,
      error: undefined,
    };
  }
}

export default TodoRepository;
