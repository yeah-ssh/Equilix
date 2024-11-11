import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Main from './components/main';
import Landing from './components/landing';
import Report from './components/report';
import MemoryGame from './components/memorygame'
import ConcentrationGame from './components/whackamole';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/main" element={<Main />} />
        <Route path="/report" element={<Report />} />
        <Route path="/games" element={<ConcentrationGame/>} />
      </Routes>
    </Router>
  );
}

export default App;
