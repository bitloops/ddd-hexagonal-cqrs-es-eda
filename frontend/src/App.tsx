import { useEffect, type JSX } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';
import { store, type AppDispatch } from './store/store';
import { useDispatch } from 'react-redux';
import { init } from './store/auth/authSlice';
import { initTodos } from './store/todo/todoSlice';

function DebugObserver() {
  useEffect(() => {
    let previousState = store.getState();

    const unsubscribe = store.subscribe(() => {
      const nextState = store.getState();
      if (previousState !== nextState) {
        console.debug('Redux state changed');
        previousState = nextState;
      }
    });

    return unsubscribe;
  }, []);

  return null;
}

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(init());
    dispatch(initTodos());
  }, [dispatch]);

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
