import React from 'react';

import TodoLayoutComponent from './TodoLayoutComponent';
import { useIamViewModel } from '../../view-models/IamViewModel';

interface TodoControllerProps {
  children: React.ReactNode;
}

function TodoLayoutController(props: TodoControllerProps): JSX.Element {
  const { children } = props;
  const { logout, useIamSelectors } = useIamViewModel();
  const { authMessage, user } = useIamSelectors();

  return (
    <TodoLayoutComponent
      errorMessage={authMessage?.type === 'error' ? authMessage?.message : ''}
      user={user}
      logout={logout}
    >
      {children}
    </TodoLayoutComponent>
  );
}

export default TodoLayoutController;
