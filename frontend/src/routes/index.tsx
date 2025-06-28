import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useRoutes } from 'react-router-dom';

import AuthLayout from '../layouts/Auth';
import TodoLayout from '../layouts/todo';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import NotFoundPage from '../pages/NotFound';
import ProtectedRoute from './protected-route';
import HomePage from '../pages/Home';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const Routes: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // List of public routes
    const publicRoutes = ['/login', '/register'];
    // If not authenticated and not on a public route, redirect to /login
    if (
      !isAuthenticated &&
      !publicRoutes.includes(location.pathname)
    ) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);


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
