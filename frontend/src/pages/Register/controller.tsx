import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import RegisterPage from './page';
import { useIamViewModel } from '../../view-models/IamViewModel';
// import ErrorContext from '../../context/Error';
// import { useSuggestedMatchesViewModel } from '../../viewModels/SuggestedMatchViewModel';

const LoginController: React.FC = () => {
  const iamViewModel = useIamViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    if (iamViewModel.isAuthenticated) {
      navigate('/');
    }
  }, [iamViewModel.isAuthenticated]);

  useEffect(() => {
    if (iamViewModel.authMessage?.type === 'success') {
      // iamViewModel.loginWithEmailPassword();
    }
  }, [iamViewModel.authMessage]);

  // const visitLoginPage = () => {
  //   navigate('/login');
  // };

  // const handleSubmit = async (): Promise<void> => {
  //   iamViewModel.registerWithEmailPassword();
  // };

  return <RegisterPage />;
};

const Register = observer(LoginController);

export default Register;
