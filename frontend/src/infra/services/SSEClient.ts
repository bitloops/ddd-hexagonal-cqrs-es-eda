import { EventSourcePolyfill } from 'event-source-polyfill';
import { todoSseControllerOn } from '../../api/sdk.gen';
import { TODO_URL } from '../../config';

type SSEClientOptions = {
  onMessage?: (event: MessageEvent) => void;
  onError?: (error: Error) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export class SSEClient {
  private eventSource: EventSourcePolyfill | null = null;

  private reconnectAttempts = 0;

  private maxReconnectAttempts = 5; // Set a reasonable number of retries

  private reconnectInterval = 1000; // Start with 1 second

  private maxReconnectInterval = 30000; // Max 30 seconds

  private reconnectTimeout: NodeJS.Timeout | null = null;

  private baseUrl: string;

  private jwt: string | null = null;

  private isConnected = false;

  private connectionOptions: SSEClientOptions | null = null;

  private subscriptionId: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.subscriptionId = Math.random().toString(36).substr(2, 9);
  }

  public setJwt(jwt: string | null) {
    this.jwt = jwt;
  }

  private handleReconnect = () => {
    if (!this.connectionOptions) return;

    // Clear any existing timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // If we've exceeded max reconnection attempts, give up
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      if (this.connectionOptions.onError) {
        this.connectionOptions.onError(new Error('Max reconnection attempts reached'));
      }
      return;
    }

    // Calculate next reconnection time with exponential backoff
    const time = Math.min(
      this.reconnectInterval * 2 ** this.reconnectAttempts,
      this.maxReconnectInterval
    );

    console.log(
      `Reconnecting in ${time}ms... (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts += 1;
      this.connect(this.connectionOptions!);
    }, time);
  };

  public connect(options: SSEClientOptions) {
    this.disconnect();
    this.connectionOptions = options;

    if (!this.jwt) {
      console.error('JWT token is required');
      if (options.onError) {
        options.onError(new Error('JWT token is required'));
      }
      return;
    }

    try {
      this.eventSource = new EventSourcePolyfill(this.baseUrl, {
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Request-Id': this.subscriptionId,
          Connection: 'keep-alive',
        },
        heartbeatTimeout: 60000,
        withCredentials: true,
      });

      this.eventSource.onopen = () => {
        console.log('SSE connection established');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        if (options.onOpen) options.onOpen();
        todoSseControllerOn({
          body: {
            events: [
              'todo.added',
              'todo.deleted',
              'todo.modified_title',
              'todo.completed',
              'todo.uncompleted',
            ],
            subscriberId: this.subscriptionId,
          },
        });
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.isConnected = false;

        // Close and clean up the current connection
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        // Only attempt to reconnect if we were previously connected
        // This prevents reconnection attempts for initial connection failures
        if (this.reconnectAttempts > 0 || this.isConnected) {
          this.handleReconnect();
        } else if (options.onError) {
          options.onError(new Error('Failed to establish initial connection'));
        }
      };

      this.eventSource.onmessage = (event) => {
        if (options.onMessage) {
          options.onMessage(event as unknown as MessageEvent);
        }
      };
    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      this.isConnected = false;
      if (options.onError) {
        options.onError(
          error instanceof Error ? error : new Error('Failed to create SSE connection')
        );
      }
      this.handleReconnect();
    }
  }

  public disconnect() {
    this.isConnected = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.reconnectAttempts = 0;
    this.connectionOptions = null;
  }

  public isConnectedToServer(): boolean {
    return this.isConnected;
  }
}

// Create a singleton instance
export const todoSSEClient = new SSEClient(`${TODO_URL}/sse/todos/stream`);
