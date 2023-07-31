import React from 'react';

import AuthLayoutComponent from './AuthLayoutComponent';
import { useIamViewModel } from '../../view-models/IamViewModel';

interface AuthControllerProps {
  children: React.ReactNode;
}

function AuthLayoutController(props: AuthControllerProps): JSX.Element {
  const { children } = props;
  const { useIamSelectors } = useIamViewModel();
  const { authMessage } = useIamSelectors();

  return <AuthLayoutComponent authMessage={authMessage}>{children}</AuthLayoutComponent>;
}

export default AuthLayoutController;
