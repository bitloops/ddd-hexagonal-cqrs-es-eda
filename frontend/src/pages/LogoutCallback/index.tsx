import { useEffect, useRef } from 'react';
import { Text } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { completeLogout } from '../../store/auth/authSlice';
import type { AppDispatch } from '../../store/store';

function LogoutCallbackPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const callbackStarted = useRef(false);

  useEffect(() => {
    if (callbackStarted.current) return;
    callbackStarted.current = true;
    void dispatch(completeLogout())
      .unwrap()
      .finally(() => navigate('/login', { replace: true }));
  }, [dispatch, navigate]);

  return <Text>Completing sign-out…</Text>;
}

export default LogoutCallbackPage;
