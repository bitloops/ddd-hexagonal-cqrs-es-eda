import { type JSX, type ReactNode } from 'react';
import { useRecoilValue } from 'recoil';

import AuthLayoutComponent from './AuthLayoutComponent';
import { authMessageState } from '../../state/auth';

interface AuthControllerProps {
  children: ReactNode;
}

function AuthLayoutController(props: AuthControllerProps): JSX.Element {
  const { children } = props;
  const authMessage = useRecoilValue(authMessageState);

  return <AuthLayoutComponent authMessage={authMessage}>{children}</AuthLayoutComponent>;
}

export default AuthLayoutController;
