import { useEffect, useRef } from 'react';
import { Text } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { completeLogin } from '../../store/auth/authSlice';
import type { AppDispatch } from '../../store/store';

function AuthCallbackPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const callbackStarted = useRef(false);

  useEffect(() => {
    if (callbackStarted.current) return;
    callbackStarted.current = true;

    void dispatch(completeLogin())
      .unwrap()
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login', { replace: true }));
  }, [dispatch, navigate]);

  return <Text>Completing secure sign-in…</Text>;
}

export default AuthCallbackPage;
