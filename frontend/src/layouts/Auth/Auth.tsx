import * as React from 'react';

import { Outlet } from 'react-router-dom';
import './Layout.css';
import Heading from '../../components/Heading';

const Layout: React.FC = () => (
  <div className="layout_auth">
    <Heading />
    <Outlet />
  </div>
);

export default Layout;
