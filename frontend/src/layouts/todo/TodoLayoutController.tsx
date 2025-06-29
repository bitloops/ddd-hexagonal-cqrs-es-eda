import React from 'react';

import TodoLayoutComponent from './TodoLayoutComponent';
import type { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth/authSlice';

interface TodoControllerProps {
  children: React.ReactNode;
}

function TodoLayoutController(props: TodoControllerProps): JSX.Element {
  const { children } = props;

  const { authMessage, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <TodoLayoutComponent
      errorMessage={authMessage?.type === 'error' ? authMessage?.message : ''}
      user={user}
      logout={() => dispatch(logout())}
    >
      {children}
    </TodoLayoutComponent>
  );
}

export default TodoLayoutController;
