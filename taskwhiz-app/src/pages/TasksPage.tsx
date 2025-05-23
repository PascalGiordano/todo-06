import React from 'react';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

const TasksPage: React.FC = () => {
  return (
    // The page background is handled by App.tsx's main content area (bg-gray-100 dark:bg-gray-900)
    // We just need to ensure text colors within this page's direct content are theme-aware if not handled by sub-components.
    // TaskForm and TaskList will handle their own internal theming.
    // The p-4 was removed as App.tsx main already has p-6. space-y-8 is fine.
    <div className="space-y-8"> 
      <TaskForm />
      <TaskList />
    </div>
  );
};

export default TasksPage;
