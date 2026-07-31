import { useEffect, useRef, type JSX } from 'react';
import { BrowserRouter as Router } from 'react-router';

import Routes from './routes';
import { store, type AppDispatch } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  authenticationChanged,
  initialiseAuthentication,
  observeAuthentication,
} from './store/auth/authSlice';
import { initTodos } from './store/todo/todoSlice';
import type { RootState } from './store/store';

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
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const initialisationStarted = useRef(false);

  useEffect(() => {
    const unsubscribe = observeAuthentication((user) => {
      dispatch(authenticationChanged(user));
    });
    const isOidcCallback = window.location.pathname.startsWith('/auth/');
    if (!isOidcCallback && !initialisationStarted.current) {
      initialisationStarted.current = true;
      void dispatch(initialiseAuthentication());
    }
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) void dispatch(initTodos());
  }, [dispatch, isAuthenticated]);

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
