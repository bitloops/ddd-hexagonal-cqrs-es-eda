import React, { useEffect } from 'react';
import { useRecoilCallback, useRecoilSnapshot, useSetRecoilState } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';
import { todoIdsState, todosState } from './state/todos';
import { useTodoViewModel } from './view-models/TodoViewModel';
import { useIamViewModel } from './view-models/IamViewModel';
import {
  authMessageState,
  emailSelector,
  emailState,
  isProcessingState,
  passwordSelector,
  passwordState,
  userState,
} from './state/auth';
import Todo from './models/Todo';

function App(): JSX.Element {
  // IamViewModel
  const iamViewModel = useIamViewModel();
  const setAuthMessage = useSetRecoilState(authMessageState);
  const setUser = useSetRecoilState(userState);
  const setEmail = useSetRecoilState(emailState);
  const setPassword = useSetRecoilState(passwordState);
  const setIsProcessing = useSetRecoilState(isProcessingState);
  const getUser = useRecoilCallback(({ snapshot }) => () => {
    const loadable = snapshot.getLoadable(userState);
    return loadable.state === 'hasValue' ? loadable.contents : null;
  });
  const getEmail = useRecoilCallback(({ snapshot }) => () => {
    const loadable = snapshot.getLoadable(emailSelector);
    return loadable.state === 'hasValue' ? loadable.contents : null;
  });
  const getPassword = useRecoilCallback(({ snapshot }) => () => {
    const loadable = snapshot.getLoadable(passwordSelector);
    return loadable.state === 'hasValue' ? loadable.contents : null;
  });

  // TodoViewModel
  const todoViewModel = useTodoViewModel();
  const setTodoIds = useSetRecoilState(todoIdsState);
  const setTodoItem = useRecoilCallback(({ set }) => (todo: Todo) => {
    set(todosState(todo.id), todo);
  });
  const getTodoIds = useRecoilCallback(({ snapshot }) => () => {
    const loadable = snapshot.getLoadable(todoIdsState);
    return loadable.state === 'hasValue' ? loadable.contents : [];
  });
  const getTodoItem = useRecoilCallback(({ snapshot }) => (id: string) => {
    const loadable = snapshot.getLoadable(todosState(id));
    return loadable.state === 'hasValue' ? loadable.contents : null;
  });
  // TODO add useResetRecoilState() to reset a specific todo atom

  useEffect(() => {
    // IamViewModel
    iamViewModel.setSetters(setAuthMessage, setUser, setEmail, setPassword, setIsProcessing);
    iamViewModel.setGetters(getUser, getEmail, getPassword);

    iamViewModel.init();

    // TodoViewModel
    todoViewModel.setSetters(setTodoItem, setTodoIds);
    todoViewModel.setGetters(getTodoItem, getTodoIds);

    todoViewModel.init();
  }, []);

  function DebugObserver() {
    const snapshot = useRecoilSnapshot();
    useEffect(() => {
      // eslint-disable-next-line no-console
      console.debug('The following atoms were modified:');
      // eslint-disable-next-line no-restricted-syntax
      for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
        // eslint-disable-next-line no-console
        console.debug(node.key, snapshot.getLoadable(node));
      }
    }, [snapshot]);

    return null;
  }

  return (
    <div className="App">
      <DebugObserver />
      <Router>
        <Routes />
      </Router>
    </div>
  );
}

export default App;
