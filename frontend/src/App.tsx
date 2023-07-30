import React, { useEffect } from 'react';
import { useRecoilCallback, useRecoilSnapshot, useSetRecoilState } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import { Todo, todoIdsState, todosState } from './state/todos';
import { useTodoViewModel } from './view-models/TodoViewModel';

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

  useEffect(() => {
    todoViewModel.setSetters(setTodoIds, setTodoItem);
    todoViewModel.setGetters(getTodoIds, getTodoItem);
  }, []);

  function DebugObserver() {
    const snapshot = useRecoilSnapshot();
    useEffect(() => {
      console.debug('The following atoms were modified:');
      // eslint-disable-next-line no-restricted-syntax
      for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
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
