import * as React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => (
  <div>
    This is the auth layout
    <Outlet />
  </div>
);

export default Layout;
