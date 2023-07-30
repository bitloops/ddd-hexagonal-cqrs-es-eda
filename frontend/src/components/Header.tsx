// import { BitloopsUser } from 'bitloops';
import React from 'react';
import { User } from '../models/User';

interface HeaderProps {
  user: User;
  logout: () => void;
}

function Header(props: HeaderProps) {
  const { user, logout } = props;
  if (user)
    return (
      <>
        <div>Hello user!</div>
        <button onClick={logout} type="submit">
          Logout
        </button>
      </>
    );
  return null;
}

export default Header;
