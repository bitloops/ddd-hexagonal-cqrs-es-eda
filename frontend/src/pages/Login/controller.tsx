import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useIamViewModel } from '../../view-models/IamViewModel';
import LoginPage from './page';
import { useRecoilValue } from 'recoil';
import { emailSelector, isProcessingState, isAuthenticatedSelector, passwordSelector } from '../../state/auth';

const LoginController: FC = () => {
  const { loginWithEmailPassword, updateEmail, updatePassword } =
    useIamViewModel();
  const navigate = useNavigate();
  const email = useRecoilValue(emailSelector);
  const password = useRecoilValue(passwordSelector);
  const isProcessing = useRecoilValue(isProcessingState);
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

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
          loginWithEmailPassword(email, password, clearEmailAndPassword);
      }}
      isProcessing={isProcessing}
    />
  );
};

export default LoginController;
