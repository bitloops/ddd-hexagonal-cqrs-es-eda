// import { BitloopsUser } from 'bitloops';
import React from 'react';

interface HeaderProps {
  user: {access_token: string}; // BitloopsUser;
  logout: () => void;
}

function Header(props: HeaderProps) {
  const { user, logout } = props;
  if (user) return (<>
    <div>Hello user!</div>
    <button onClick={logout} type="submit">Logout</button>
  </>);
  return null
}

export default Header;
