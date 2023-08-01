import React, { useEffect } from 'react';
import { Outlet, useNavigate, useRoutes } from 'react-router-dom';

import AuthLayout from '../layouts/Auth';
import TodoLayout from '../layouts/todo';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import NotFoundPage from '../pages/NotFound';
import ProtectedRoute from './protected-route';
import HomePage from '../pages/Home';
import { useIamViewModel } from '../view-models/IamViewModel';

const Routes: React.FC = () => {
  const { useIamSelectors } = useIamViewModel();
  const { isAuthenticated } = useIamSelectors();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const element = useRoutes([
    {
      path: 'login',
      element: (
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      ),
      children: [{ path: '/login', element: <LoginPage /> }],
    },
    {
      path: 'register',
      element: (
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      ),
      children: [{ path: '/register', element: <RegisterPage /> }],
    },
    {
      path: '/',
      element: isAuthenticated ? (
        <TodoLayout>
          <Outlet />
        </TodoLayout>
      ) : null,
      children: [
        {
          path: '/',
          element: <ProtectedRoute element={<HomePage />} />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);

  return element;
};

export default Routes;
