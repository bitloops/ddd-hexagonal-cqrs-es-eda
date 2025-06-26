import { FiLogOut } from 'react-icons/fi';
import { Tooltip } from '../ui/Tooltip';

import { type User } from '../../models/User';
import './Header.css';

interface HeaderProps {
  user: User;
  logout: () => void;
}

function Header(props: HeaderProps) {
  const { user, logout } = props;
  if (user)
    return (
      <Tooltip content="Logout">
        <button className="logout_button" onClick={logout} type="submit">
          <FiLogOut />
        </button>
      </Tooltip>
    );
  return null;
}

export default Header;
