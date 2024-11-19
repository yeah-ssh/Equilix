// PageWrapper.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './login';
import Main from './main';
import Landing from './landing';
import Report from './report';
import ConcentrationGame from './whackamole';
import AIComponent from './aicomponent';
import Loader from './loader';
import MazeGame from './mazegame';

const PageWrapper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Trigger loader on route change
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {isLoading && <Loader />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/report" element={<Report />} />
        <Route path="/games" element={<ConcentrationGame />} />
        <Route path="/gpt" element={<AIComponent />} />
        <Route path="/maze" element={<MazeGame/> }/>
      </Routes>
    </>
  );
};

export default PageWrapper;
