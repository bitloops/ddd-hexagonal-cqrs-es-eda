import React, { useEffect } from 'react';
import { Outlet, useNavigate, useRoutes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import AuthLayout from '../layouts/Auth/Auth';
import DashboardLayout from '../layouts/todo';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import NotFoundPage from '../pages/NotFound';
import ProtectedRoute from './protected-route';
import HomePage from '../pages/Home';
import { isAuthenticatedSelector } from '../state/auth';

const Routes: React.FC = () => {
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const element = useRoutes([
    {
      path: 'login',
      element: <AuthLayout />,
      children: [{ path: '/login', element: <LoginPage /> }],
    },
    {
      path: 'register',
      element: <AuthLayout />,
      children: [{ path: '/register', element: <RegisterPage /> }], // TODO refactor the registration page to use the same form as the login page
    },
    {
      path: '/',
      element: isAuthenticated ? (
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
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
