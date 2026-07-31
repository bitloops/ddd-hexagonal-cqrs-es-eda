import { useEffect } from 'react';
import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { register } from '../../store/auth/authSlice';
import type { AppDispatch, RootState } from '../../store/store';
import RegisterPage from './page';

const RegisterController: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, isProcessing } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <RegisterPage
      isProcessing={isProcessing}
      register={() => void dispatch(register())}
    />
  );
};

export default RegisterController;
