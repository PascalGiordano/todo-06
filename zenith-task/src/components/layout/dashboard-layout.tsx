import React from 'react';
import Sidebar from '@/components/sidebar/sidebar'; // Assuming '@' is configured for src

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* Placeholder for a top Navbar if needed later */}
        {/* <div className="h-16 bg-background border-b border-gray-700 mb-6">Navbar Placeholder</div> */}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
