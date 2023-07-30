import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useIamViewModel } from '../../view-models/IamViewModel';
import RegisterPage from './page';
import {
  emailSelector,
  emailState,
  isAuthenticatedSelector,
  passwordSelector,
  passwordState,
} from '../../state/auth';

const LoginController: React.FC = () => {
  const { isProcessing, loginWithEmailPassword, registerWithEmailPassword } = useIamViewModel();
  const navigate = useNavigate();
  const email = useRecoilValue(emailSelector);
  const password = useRecoilValue(passwordSelector);
  const updateEmail = useSetRecoilState(emailState);
  const updatePassword = useSetRecoilState(passwordState);
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);

  useEffect(() => {
    if (isAuthenticated) {
      // TODO either need to use mobx or recoil to re-render on auth change
      navigate('/');
    }
  }, [isAuthenticated]);

  const clearEmailAndPassword = () => {
    updateEmail('');
    updatePassword('');
  };

  return (
    <RegisterPage
      email={email}
      password={password}
      updateEmail={updateEmail}
      updatePassword={updatePassword}
      submit={() => {
        if (email.isValid && password.isValid)
          registerWithEmailPassword(email, password, () => {
            loginWithEmailPassword(email, password, clearEmailAndPassword);
          });
      }}
      isProcessing={isProcessing}
    />
  );
};

const Login = observer(LoginController);

export default Login;
