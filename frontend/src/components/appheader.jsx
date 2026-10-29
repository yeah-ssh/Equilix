import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Brand from './brand';
import { clearSession, getEmail } from '../session';

const AppHeader = () => {
  const navigate = useNavigate();
  const email = getEmail();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Brand to="/main" />
      <nav className="app-nav" aria-label="Main">
        <NavLink to="/main" end>Check-in</NavLink>
        <NavLink to="/report">Results</NavLink>
        <NavLink to="/games">Games</NavLink>
        <NavLink to="/gpt">Talk</NavLink>
      </nav>
      <div className="app-header-user">
        {email && <span className="app-header-email">{email}</span>}
        <button type="button" className="btn btn-text" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
