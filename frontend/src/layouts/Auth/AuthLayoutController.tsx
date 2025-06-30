import { type JSX, type ReactNode } from 'react';

import AuthLayoutComponent from './AuthLayoutComponent';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface AuthControllerProps {
  children: ReactNode;
}

function AuthLayoutController(props: AuthControllerProps): JSX.Element {
  const { children } = props;
  const authMessage = useSelector((state: RootState) => state.auth.authMessage);

  return <AuthLayoutComponent authMessage={authMessage}>{children}</AuthLayoutComponent>;
}

export default AuthLayoutController;
