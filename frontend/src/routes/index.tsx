import { Outlet, useRoutes } from 'react-router';

import AuthLayout from '../layouts/Auth';
import TodoLayout from '../layouts/todo';
import AuthCallbackPage from '../pages/AuthCallback';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import LogoutCallbackPage from '../pages/LogoutCallback';
import NotFoundPage from '../pages/NotFound';
import RegisterPage from '../pages/Register';
import ProtectedRoute from './protected-route';

const authLayout = (
  <AuthLayout>
    <Outlet />
  </AuthLayout>
);

function Routes() {
  return useRoutes([
    {
      element: authLayout,
      children: [
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
        { path: '/auth/callback', element: <AuthCallbackPage /> },
        { path: '/auth/logout/callback', element: <LogoutCallbackPage /> },
      ],
    },
    {
      path: '/',
      element: (
        <ProtectedRoute
          element={
            <TodoLayout>
              <Outlet />
            </TodoLayout>
          }
        />
      ),
      children: [{ index: true, element: <HomePage /> }],
    },
    { path: '*', element: <NotFoundPage /> },
  ]);
}

export default Routes;
