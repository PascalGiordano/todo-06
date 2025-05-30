"use client"; // Needed for useState and onClick handlers

import React, { useState } from 'react';
import { LayoutDashboard, FolderKanban, CheckSquare, NotebookText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isCollapsed }) => {
  return (
    <a
      href="#" // Replace with actual links later
      className="flex items-center p-3 my-1 text-muted-foreground hover:text-foreground hover:bg-gray-700/50 rounded-lg transition-colors duration-150"
    >
      <Icon size={24} className="text-primary" />
      {!isCollapsed && <span className="ml-4 font-medium">{label}</span>}
    </a>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`h-screen bg-background border-r border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        {!isCollapsed && <h2 className="text-2xl font-bold text-foreground">Zenith</h2>}
        <button
          onClick={toggleSidebar}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-gray-700/50 rounded-lg"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
      <nav className="flex-grow p-4 space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
        <NavItem icon={FolderKanban} label="Projects" isCollapsed={isCollapsed} />
        <NavItem icon={CheckSquare} label="Tasks" isCollapsed={isCollapsed} />
        <NavItem icon={NotebookText} label="Notes" isCollapsed={isCollapsed} />
        <NavItem icon={Settings} label="Settings" isCollapsed={isCollapsed} />
      </nav>
      <div className="p-4 border-t border-gray-700">
        {/* User profile section can go here later */}
        {!isCollapsed && <p className="text-sm text-muted-foreground">© Zenith Task</p>}
      </div>
    </aside>
  );
};

export default Sidebar;
