import { useEffect, type JSX } from 'react';
import { useRecoilCallback, useRecoilSnapshot, useSetRecoilState } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';
import { todoIdsState, todosState } from './state/todos';
import { useTodoViewModel } from './view-models/TodoViewModel';
import { type Todo } from './models/Todo';
import type { AppDispatch } from './store/store';
import { useDispatch } from 'react-redux';
import { init } from './features/auth/authSlice';

function App(): JSX.Element {
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
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    // TodoViewModel
    todoViewModel.setSetters(setTodoItem, setTodoIds);
    todoViewModel.setGetters(getTodoItem, getTodoIds);
    dispatch(init())

    todoViewModel.init();
    todoViewModel.fetchAllTodo();
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
