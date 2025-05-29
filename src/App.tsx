import React from 'react';
import LandingPage from '@/pages/LandingPage'; // Using path alias

// If App.css or other global App-specific styles were used, they would be imported here.
// For now, global styles are primarily handled by src/styles/globals.css

const App: React.FC = () => {
  return (
    <LandingPage />
  );
};

export default App;
