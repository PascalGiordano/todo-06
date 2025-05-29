import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 className="text-4xl font-bold mb-4">Welcome to the Landing Page!</h1>
      <p className="text-lg">This is a placeholder for the future marketing landing page.</p>
      <p className="mt-4">Current theme primary color: <span className="text-primary">Example Text</span></p>
      <div className="p-4 mt-2 border border-border rounded-md bg-card text-card-foreground">
        This is a card using theme variables.
      </div>
    </div>
  );
};

export default LandingPage;
