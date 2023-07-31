import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useIamViewModel } from '../view-models/IamViewModel';

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const navigate = useNavigate();
  const { useIamSelectors } = useIamViewModel();
  const { user } = useIamSelectors();

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user]);

  return user !== null ? element : null;
}

export default ProtectedRoute;
