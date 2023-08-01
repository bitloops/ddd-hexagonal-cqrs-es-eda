import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { Tooltip } from '@chakra-ui/react';

import { User } from '../../models/User';
import './Header.css';

interface HeaderProps {
  user: User;
  logout: () => void;
}

function Header(props: HeaderProps) {
  const { user, logout } = props;
  if (user)
    return (
      <Tooltip label="Logout">
        <button className="logout_button" onClick={logout} type="submit">
          <FiLogOut />
        </button>
      </Tooltip>
    );
  return null;
}

export default Header;
