import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import RegisterPage from './page';
import { loginWithEmailPassword, registerWithEmailPassword, setEmail, setPassword } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { selectEmailValidation, selectPasswordValidation } from '../../features/auth/selector';

const LoginController: React.FC = () => {

  const updatePassword = (password: string) => {
    dispatch(setPassword(password))
  }

  const updateEmail = (email: string) => {
    dispatch(setEmail(email))
  }

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();

  const { isProcessing, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const password = useSelector(selectPasswordValidation);
  const email = useSelector(selectEmailValidation);

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
        if (email.isValid && password.isValid) {
          dispatch(registerWithEmailPassword({
            email: email.value, password: password.value, onSuccessCallback: () => {
              dispatch(loginWithEmailPassword({ email: email.value, password: password.value, onSuccessCallback: clearEmailAndPassword }))
            }
          }))
        }
      }}
      isProcessing={isProcessing}
    />
  );
};

export default LoginController;
