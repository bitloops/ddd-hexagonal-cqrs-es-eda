import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIamViewModel } from '../view-models/IamViewModel';

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const iamViewModel = useIamViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    const { isAuthenticated } = iamViewModel;
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [iamViewModel.isAuthenticated]);

  return iamViewModel.isAuthenticated ? element : null;
}

export default ProtectedRoute;
