import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app.store';
import {
  BarChart3,
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  Bot,
  Settings as SettingsIcon, // Renamed to avoid conflict with SettingsPage
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isCollapsed, isActive }) => {
  const activeClasses = "bg-primary-100 dark:bg-primary-700 dark:bg-opacity-25 text-primary-600 dark:text-primary-300";
  const inactiveClasses = "hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100";

  return (
    <li>
      <Link
        to={to}
        title={isCollapsed ? label : undefined}
        className={`flex items-center p-3 my-1 rounded-md transition-colors duration-150 ${
          isActive ? activeClasses : inactiveClasses
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        <Icon className={`h-6 w-6 ${isCollapsed ? "" : "mr-3"} ${isActive ? "" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"}`} />
        {!isCollapsed && <span className="font-medium">{label}</span>}
      </Link>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore(state => ({
    isSidebarCollapsed: state.uiState.isSidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
  }));
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/tasks", icon: CheckSquare, label: "Tasks" },
    { to: "/team", icon: Users, label: "Team" }, // Placeholder
    { to: "/reports", icon: TrendingUp, label: "Reports" }, // Placeholder
    { to: "/ai-assistant", icon: Bot, label: "AI Assistant" }, // Placeholder
  ];

  const bottomNavItems = [
    { to: "/settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <aside
      className={`bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex flex-col transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700
        ${isSidebarCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-between h-16 p-3 border-b border-gray-200 dark:border-gray-700">
        {!isSidebarCollapsed && (
          <span className="text-lg font-semibold text-primary-700 dark:text-primary-400 ml-1">Menu</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isSidebarCollapsed}
              isActive={location.pathname.startsWith(item.to) && (item.to !== "/dashboard" || location.pathname === "/dashboard" || location.pathname === "/")}
            />
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-gray-200">
        <ul>
          {bottomNavItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={isSidebarCollapsed}
              isActive={location.pathname.startsWith(item.to)}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
