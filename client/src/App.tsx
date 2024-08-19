import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainApp from './MainApp';

const App: React.FC = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};


export default App;
