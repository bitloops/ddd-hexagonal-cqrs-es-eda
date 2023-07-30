import React, { useEffect } from 'react';
import { Outlet, useNavigate, useRoutes } from 'react-router-dom';

import AuthLayout from '../layouts/Auth/Auth';
import DashboardLayout from '../layouts/todo';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
// import HomePage from '../pages/Home';
import NotFoundPage from '../pages/NotFound';
import ProtectedRoute from './protected-route';
import HomePage from '../pages/Home';

const Routes: React.FC = () => {
  const isAuthenticated = true; // Todo Fetch this from your auth service
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const element = useRoutes([
    {
      path: 'login',
      element: <AuthLayout />,
      children: [{ path: '/login', element: <LoginPage /> }],
    },
    {
      path: 'register',
      element: <AuthLayout />,
      children: [{ path: '/register', element: <RegisterPage /> }],
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
