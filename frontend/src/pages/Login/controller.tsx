import { useEffect } from 'react';
import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import type { AppDispatch, RootState } from '../../store/store';
import { login } from '../../store/auth/authSlice';
import LoginPage from './page';

const LoginController: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, isProcessing } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <LoginPage
      isProcessing={isProcessing}
      login={() => void dispatch(login())}
    />
  );
};

export default LoginController;
