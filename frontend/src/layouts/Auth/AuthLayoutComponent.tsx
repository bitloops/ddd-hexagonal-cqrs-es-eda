import * as React from 'react';

import './Layout.css';
import Heading from '../../components/Heading';
import { AuthMessage } from '../../models/Auth';
import BitloopsAlert from '../../components/Alert';

interface IAuthLayoutComponentProps {
  children: React.ReactNode;
  authMessage: AuthMessage | null;
}

function AuthLayoutComponent(props: IAuthLayoutComponentProps): JSX.Element {
  const { authMessage, children } = props;
  return (
    <div className="layout_auth">
      {authMessage && (
        <BitloopsAlert
          message={authMessage.message}
          type={authMessage.type}
          duration={authMessage.duration}
        />
      )}
      <Heading />
      {children}
    </div>
  );
}

export default AuthLayoutComponent;
