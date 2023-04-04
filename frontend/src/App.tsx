import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as grpcWeb from 'grpc-web';

import './App.css';
import { TodoServiceClient } from './bitloops/proto/TodoServiceClientPb';
import {
  AddTodoRequest,
  CompleteTodoRequest,
  DeleteTodoRequest,
  GetAllTodosRequest,
  InitializeConnectionRequest,
  KeepSubscriptionAliveRequest,
  ModifyTitleTodoRequest,
  OnTodoRequest,
  Todo,
  TODO_EVENTS,
  UncompleteTodoRequest,
} from './bitloops/proto/todo_pb';
import TodoPanel from './components/TodoPanel';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import { AUTH_URL, REGISTRATION_URL } from './config';

function isEmailValid(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

async function sha256Hash(message: string) {
  // Convert the message to a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  // Generate the hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}

function App(props: { service: TodoServiceClient }): JSX.Element {
  const { service } = props;
  const [todos, setTodos] = useState<Todo.AsObject[]>(
    localStorage.getItem('todos')
      ? JSON.parse(localStorage.getItem('todos') || '')
      : []
  );
  const [user, setUser] = useState<{ access_token: string } | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [subscriptionInterval, setSubscriptionInterval] =
    useState<NodeJS.Timer | null>(null);
  const [subscriptionStream, setSubscriptionStream] =
    useState<grpcWeb.ClientReadableStream<any> | null>(null);
  const [intervalTimestamp, setIntervalTimestamp] = useState<number>(0);
  const [event, setEvent] = useState<{
    eventName: string;
    payload: Todo.AsObject | undefined;
  } | null>(null);
  const [newValue, setNewValue] = useState('');
  const [editable, setEditable] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const loginWithEmailPassword = async (email: string, password: string) => {
    if (!isEmailValid(email))
      return setErrorMessage('Please enter a valid email address!');
    if (password.length < 1)
      return setErrorMessage('Please fill your password');
    try {
      const response = await axios.post(AUTH_URL, { email, password });
      if (response.data) {
        setUser(response.data);
      }
    } catch (error: any) {
      if (error?.response?.data?.message === 'Unauthorized')
        setErrorMessage('Invalid credentials!');
    }
  };

  const registerWithEmailPassword = async (email: string, password: string) => {
    if (!isEmailValid(email))
      return setErrorMessage('Please enter a valid email address!');
    if (password.length < 8)
      return setErrorMessage('Password must be at least 8 characters long!');
    try {
      await axios.post(REGISTRATION_URL, { email, password });
      loginWithEmailPassword(email, password);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setSubscriptionId(null);
    subscriptionStream?.cancel();
    if (subscriptionInterval) clearInterval(subscriptionInterval);
    setTodos([]);
  };

  const initializeSubscriptionConnection = async () => {
    // console.log('Initializing Subscription Connection', subscriptionId, !!subscriptionInterval);
    const request = new InitializeConnectionRequest();
    service.initializeSubscriptionConnection(
      request,
      { authorization: `Bearer ${user?.access_token}` },
      (error, response) => {
        if (error) {
          console.error(error);
        } else {
          setSubscriptionId(response?.getSubscriberid());
        }
      }
    );
  };

  useEffect(() => {
    if (subscriptionId) {
      const request = new KeepSubscriptionAliveRequest();
      request.setSubscriberid(subscriptionId);
      service.keepSubscriptionAlive(
        request,
        { authorization: `Bearer ${user?.access_token}` },
        (error, response) => {
          if (error) {
            console.log('(error as any).message', (error as any).message);
            if ((error as any).message === 'Invalid subscription') {
              initializeSubscriptionConnection();
            } else {
              console.error(error);
            }
          } else {
            if (response.getRenewedauthtoken()) {
              setUser({
                ...user,
                access_token: response.getRenewedauthtoken(),
              });
            }
          }
        }
      );
    } else if (user) {
      initializeSubscriptionConnection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalTimestamp]);

  useEffect(() => {
    if (localStorage.getItem('user'))
      setUser(JSON.parse(localStorage.getItem('user') || ''));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (user) {
      getAllTodos();
      localStorage.setItem('user', JSON.stringify(user));
      if (!subscriptionId) initializeSubscriptionConnection();
    } else {
      localStorage.removeItem('user');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (event) {
      console.log('event', event);
      const { eventName, payload } = event;
      if (payload)
        switch (eventName) {
          case 'onadded':
            todos.filter((todo) => todo.id === payload.id).length === 0 &&
              setTodos([...todos, payload]);
            break;
          case 'ondeleted':
            const remainingTodos = todos.filter(
              (todo) => todo.id !== payload.id
            );
            setTodos(remainingTodos);
            break;
          case 'onmodifiedtitle':
            setTodos(
              todos.map((todo) => {
                if (todo.id === payload.id) {
                  const changedTodo = { ...todo, title: payload.title };
                  return changedTodo;
                }
                return todo;
              })
            );
            break;
          case 'oncompleted':
            setTodos(
              todos.map((todo) => {
                if (todo.id === payload.id) {
                  const changedTodo = { ...todo, completed: true };
                  return changedTodo;
                }
                return todo;
              })
            );
            break;
          case 'onuncompleted':
            setTodos(
              todos.map((todo) => {
                if (todo.id === payload.id) {
                  const changedTodo = { ...todo, completed: false };
                  return changedTodo;
                }
                return todo;
              })
            );
            break;
          default:
            break;
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  useEffect(() => {
    if (subscriptionId) {
      if (!subscriptionInterval) {
        const interval = setInterval(() => {
          setIntervalTimestamp(Date.now());
        }, 10000);
        setSubscriptionInterval(interval);
      }
      const request = new OnTodoRequest();
      request.setEventsList([
        TODO_EVENTS.ADDED,
        TODO_EVENTS.DELETED,
        TODO_EVENTS.MODIFIED_TITLE,
        TODO_EVENTS.COMPLETED,
        TODO_EVENTS.UNCOMPLETED,
      ]);
      request.setSubscriberid(subscriptionId);
      const onStream = service.on(request, {
        authorization: `Bearer ${user?.access_token}`,
      });
      onStream.on('end', () => {
        console.log('Connection was ended');
        if (subscriptionInterval) clearInterval(subscriptionInterval);
        setSubscriptionId(null);
      });
      onStream.on('data', (event) => {
        const eventObject: { [key: string]: any } = event.toObject();
        const filteredValues = Object.keys(eventObject).filter(
          (key) => eventObject[key] !== undefined
        );
        const eventName = filteredValues[0];
        const payload =
          eventObject.onadded ||
          eventObject.ondeleted ||
          eventObject.onmodifiedtitle ||
          eventObject.oncompleted ||
          eventObject.onuncompleted;
        setEvent({ eventName, payload });
      });
      onStream.on('status', (status: grpcWeb.Status) => {
        console.log('Received connection status update:', status);
      });
      // onStream.on('metadata', (metadata: grpcWeb.Metadata) => {
      //   console.log('metadata', metadata);
      // });
      onStream.on('error', (error: any) => {
        console.log('Server disconnected, trying to reconnect...');
        // console.error(error);
        // if (subscriptionInterval) clearInterval(subscriptionInterval);
        setSubscriptionId(null);
      });
      setSubscriptionStream(onStream);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionId]);

  async function getAllTodos() {
    try {
      const response = await service.getAll(new GetAllTodosRequest(), {
        authorization: `Bearer ${user?.access_token}`,
        'cache-hash': await sha256Hash(JSON.stringify(todos)),
      });
      if (response.hasError()) {
        const error: any = response.getError();
        console.error(error?.message);
        return;
      } else {
        setTodos(
          response
            .getOk()
            ?.getTodosList()
            .map((todo) => todo.toObject()) || []
        );
      }
    } catch (error: any) {
      // If there error message is CACHE_HIT, it means that the response was
      // cached and we don't need to do anything.
      if (error.message !== 'CACHE_HIT') {
        if (error?.message === 'Invalid JWT token') {
          clearAuth();
        }
      }
    }
  }

  async function addTodo(
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>
  ) {
    e.preventDefault();
    const request = new AddTodoRequest();
    if (!newValue) setErrorMessage('Title must be at least 3 characters long!');
    else {
      request.setTitle(newValue);
      try {
        const response = await service.add(request, {
          authorization: `Bearer ${user?.access_token}`,
        });
        if (response.hasError()) {
          console.log(response);
          const error = response.getError();
          if (error?.getInvalidtitlelengtherror()) {
            const message = error?.getInvalidtitlelengtherror()?.getMessage();
            if (message)
              setErrorMessage('Title must be at least 3 characters long!');
          } else {
            console.error(error);
          }
          return;
        } else {
          setNewValue('');
        }
      } catch (error: any) {
        if (error?.message === 'Invalid JWT token') {
          clearAuth();
        }
      }
    }
  }

  async function modifyTodoTitle(e: any) {
    const { id, value } = e.target;
    const request = new ModifyTitleTodoRequest();
    request.setId(id);
    request.setTitle(value);
    const response = await service.modifyTitle(request, {
      authorization: `Bearer ${user?.access_token}`,
    });
    if (response.hasError()) {
      const error: any = response.getError();
      if (error?.message === 'Invalid JWT token') {
        clearAuth();
      }
      return;
    }
  }

  async function deleteTodo(id: string) {
    const request = new DeleteTodoRequest();
    request.setId(id);
    try {
      await service.delete(request, {
        authorization: `Bearer ${user?.access_token}`,
      });
    } catch (error: any) {
      if (error?.message === 'Invalid JWT token') {
        clearAuth();
      }
    }
  }

  async function completeTodo(id: string) {
    const request = new CompleteTodoRequest();
    request.setId(id);
    try {
      await service.complete(request, {
        authorization: `Bearer ${user?.access_token}`,
      });
    } catch (error: any) {
      if (error?.message === 'Invalid JWT token') {
        clearAuth();
      }
    }
  }

  async function uncompleteTodo(id: string) {
    const request = new UncompleteTodoRequest();
    request.setId(id);
    try {
      await service.uncomplete(request, {
        authorization: `Bearer ${user?.access_token}`,
      });
    } catch (error: any) {
      if (error?.message === 'Invalid JWT token') {
        clearAuth();
      }
    }
  }

  async function updateLocalItem(e: any) {
    const { id, value } = e.target;
    const newData: Todo.AsObject[] = JSON.parse(JSON.stringify(todos));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].title = value;
        setTodos(newData);
        break;
      }
    }
  }

  async function handleCheckbox(e: any): Promise<void> {
    const { id } = e.target;
    const { checked } = e.target;
    const newData: Todo.AsObject[] = JSON.parse(JSON.stringify(todos));
    for (let i = 0; i < newData.length; i += 1) {
      if (newData[i].id === id) {
        newData[i].completed = checked;
        if (checked) {
          await completeTodo(newData[i].id);
        } else {
          await uncompleteTodo(newData[i].id);
        }
      }
    }
  }

  return (
    <div className="App">
      {user && <Header user={user} logout={clearAuth} />}
      {!user && (
        <LoginForm
          loginWithEmailPassword={loginWithEmailPassword}
          registerWithEmailPassword={registerWithEmailPassword}
        />
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {user && (
        <TodoPanel
          newValue={newValue}
          setNewValue={setNewValue}
          addItem={addTodo}
          updateLocalItem={updateLocalItem}
          modifyTitle={modifyTodoTitle}
          removeItem={deleteTodo}
          editable={editable}
          setEditable={setEditable}
          handleCheckbox={handleCheckbox}
          data={todos}
        />
      )}
    </div>
  );
}

export default App;
