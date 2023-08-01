import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useIamViewModel } from '../../view-models/IamViewModel';
import RegisterPage from './page';

const LoginController: React.FC = () => {
  const {
    loginWithEmailPassword,
    registerWithEmailPassword,
    updateEmail,
    updatePassword,
    useIamSelectors,
  } = useIamViewModel();
  const navigate = useNavigate();
  const { email, password, isProcessing, isAuthenticated } = useIamSelectors();

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

export default LoginController;
