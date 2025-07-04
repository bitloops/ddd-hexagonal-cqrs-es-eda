import { type JSX, type ReactNode } from 'react';

import Header from '../../components/Header';
import { type User } from '../../models/User';
import './Layout.css';

interface IDashboardLayout {
  user: User | null;
  logout: () => void;
  errorMessage: string;
  children: ReactNode;
}

function TodoLayoutComponent(props: IDashboardLayout): JSX.Element {
  const { user, logout, errorMessage, children } = props;

  return (
    <div className="layout_home">
      {user && <Header user={user} logout={logout} />}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {children}
    </div>
  );
}

export default TodoLayoutComponent;
