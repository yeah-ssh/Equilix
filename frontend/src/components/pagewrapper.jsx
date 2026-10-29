// PageWrapper.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './login';
import Main from './main';
import Landing from './landing';
import Report from './report';
import GamesPage from './gamespage';
import ChatPage from './chatpage';
import { getToken } from '../session';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

const PageWrapper = () => {
  const location = useLocation();

  return (
    <div className="page-enter" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<RequireAuth><Main /></RequireAuth>} />
        <Route path="/report" element={<RequireAuth><Report /></RequireAuth>} />
        <Route path="/games" element={<RequireAuth><GamesPage /></RequireAuth>} />
        <Route path="/maze" element={<RequireAuth><GamesPage initialGame="maze" /></RequireAuth>} />
        <Route path="/gpt" element={<RequireAuth><ChatPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default PageWrapper;
