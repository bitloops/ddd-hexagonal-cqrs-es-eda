import React from 'react';
import TodoPanel from '../../components/Todo/Panel';
import { User } from '../../models/User';

interface HomePageProps {
  user: User | null;
}

function HomePage({ user }: HomePageProps): JSX.Element {
  return <div id="page-home">{user && <TodoPanel />}</div>;
}
export default HomePage;
