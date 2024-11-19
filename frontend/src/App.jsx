// App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageWrapper from './components/pagewrapper';

const App = () => {
  return (
    <Router>
      <PageWrapper />
    </Router>
  );
};

export default App;
