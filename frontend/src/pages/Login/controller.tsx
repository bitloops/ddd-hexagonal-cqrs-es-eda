import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useIamViewModel } from '../../view-models/IamViewModel';
import LoginPage from './page';
import { emailSelector, emailState, passwordSelector, passwordState } from '../../state/auth';

const LoginController: React.FC = () => {
  const iamViewModel = useIamViewModel();
  const navigate = useNavigate();
  const email = useRecoilValue(emailSelector);
  const password = useRecoilValue(passwordSelector);
  const updateEmail = useSetRecoilState(emailState);
  const updatePassword = useSetRecoilState(passwordState);

  useEffect(() => {
    if (iamViewModel.isAuthenticated) {
      // TODO either need to use mobx or recoil to re-render on auth change
      navigate('/');
    }
  }, [iamViewModel.isAuthenticated]);

  const clearEmailAndPassword = () => {
    updateEmail('');
    updatePassword('');
  };

  return (
    <LoginPage
      email={email}
      password={password}
      updateEmail={updateEmail}
      updatePassword={updatePassword}
      submit={() => {
        if (email.isValid && password.isValid)
          iamViewModel.loginWithEmailPassword(email, password, clearEmailAndPassword);
      }}
      isProcessing={iamViewModel.isProcessing}
    />
  );
};

const Login = observer(LoginController);

export default Login;
