import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../state/auth';

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user]);

  return user !== null ? element : null;
}

export default ProtectedRoute;
