import React from 'react';
import HomeComponent from './page';
import { useIamViewModel } from '../../view-models/IamViewModel';

const HomeController: React.FC = () => {
  const iamViewModel = useIamViewModel();
  const { user, logout } = iamViewModel;
  const { authMessage } = iamViewModel;

  return (
    <HomeComponent
      user={user}
      logout={logout}
      errorMessage={authMessage?.type === 'error' ? authMessage?.message : ''}
    />
  );
};

export default HomeController;
