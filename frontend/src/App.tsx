import { useEffect, type JSX } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';
import { store, type AppDispatch } from './store/store';
import { useDispatch } from 'react-redux';
import { init } from './features/auth/authSlice';
import { initTodos } from './features/todo/todoSlice';

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(init()) // init Auth
    dispatch(initTodos()) // Init Todos
  }, []);

  function DebugObserver() {
    let prevState = store.getState();

    store.subscribe(() => {
      const nextState = store.getState();
      if (prevState !== nextState) {
        console.debug('Redux state changed');
        prevState = nextState;
      }
    });
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
