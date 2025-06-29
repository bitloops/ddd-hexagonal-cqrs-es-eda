import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPage from './page';
import type { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithEmailPassword, setEmail, setPassword } from '../../store/auth/authSlice';
import { selectEmailValidation, selectPasswordValidation } from '../../store/auth/selector';

const LoginController: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const updatePassword = (password: string) => {
    dispatch(setPassword(password))
  }

  const updateEmail = (email: string) => {
    dispatch(setEmail(email))
  }
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
    <LoginPage
      email={email}
      password={password}
      updateEmail={updateEmail}
      updatePassword={updatePassword}
      submit={() => {
        if (email.isValid && password.isValid) {
          dispatch(loginWithEmailPassword({ email: email.value, password: password.value, onSuccessCallback: clearEmailAndPassword }))
        }
      }}
      isProcessing={isProcessing}
    />
  );
};

export default LoginController;
