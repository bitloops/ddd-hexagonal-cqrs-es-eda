import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import type { RootState } from '../store/store';

function ProtectedRoute({ element }: { element: ReactNode }) {
  const { isAuthenticated, isInitialising } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isInitialising) return null;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
