import React from 'react';
import HomeComponent from './page';
import { useIamViewModel } from '../../view-models/IamViewModel';

const HomeController: React.FC = () => {
  const iamViewModel = useIamViewModel();
  const { user } = iamViewModel;

  return <HomeComponent user={user} />;
};

export default HomeController;
