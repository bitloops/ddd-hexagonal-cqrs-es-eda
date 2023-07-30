import React from 'react';
import TodoPanel from '../../components/Todo/Panel';
import Header from '../../components/Header';
import { User } from '../../models/User';

interface HomePageProps {
  user: User | null;
  logout: () => void;
  errorMessage: string;
}

function HomePage({ user, logout, errorMessage }: HomePageProps): JSX.Element {
  return (
    <div id="page-home">
      {user && <Header user={user} logout={logout} />}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {user && <TodoPanel />}
    </div>
  );
}
export default HomePage;
