import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { useSelector } from 'react-redux';

function ProtectedRoute({ element }: { element: ReactNode }) {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user]);

  return user !== null ? element : null;
}

export default ProtectedRoute;
