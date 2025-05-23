import React from 'react';
import { useAppStore } from '../../store/app.store';
import type { Task, Priority, Status } from '../../types';
import * as Icons from 'lucide-react'; // For potential icons

const TaskList: React.FC = () => {
  const { tasks, priorities, statuses, deleteTask } = useAppStore((state) => ({
    tasks: Object.values(state.tasks.data).sort((a,b) => b.createdAt - a.createdAt), // Sort by newest first
    priorities: state.priorities.data,
    statuses: state.statuses.data,
    deleteTask: state.deleteTask,
  }));

  const getPriorityById = (priorityId: string): Priority | undefined => {
    return priorities[priorityId];
  };

  const getStatusById = (statusId: string): Status | undefined => {
    return statuses[statusId];
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTask(taskId);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <Icons.ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Aucune tâche pour le moment.</p>
        <p className="text-gray-600 dark:text-gray-400">Commencez par créer une nouvelle tâche ci-dessus.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mt-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 p-6 border-b border-gray-200 dark:border-gray-700">
        Liste des Tâches
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priorité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Créée le</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => {
              const priority = getPriorityById(task.priorityId);
              const status = getStatusById(task.statusId);
              const PriorityIcon = priority?.icon ? (Icons as any)[priority.icon as keyof typeof Icons] : null;
              const StatusIcon = status?.icon ? (Icons as any)[status.icon as keyof typeof Icons] : null;

              return (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-normal max-w-xs">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate" title={task.description}>
                        {task.description || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {priority ? (
                      <span 
                        className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center"
                        // Using inline styles for dynamic colors is acceptable, Tailwind JIT can't generate all possibilities
                        // However, text color might need adjustment based on background for accessibility if not handled by badge color itself
                        style={{ 
                            backgroundColor: `${priority.color}33`, // Add opacity to background
                            color: priority.color // Assuming this color has good contrast with its lightened background
                        }}
                      >
                        {PriorityIcon && <PriorityIcon className="h-4 w-4 mr-1.5" style={{ color: priority.color }} />}
                        {priority.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">Inconnue</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {status ? (
                       <span 
                        className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center"
                        style={{ 
                            backgroundColor: `${status.color}33`, 
                            color: status.color
                        }}
                      >
                        {StatusIcon && <StatusIcon className="h-4 w-4 mr-1.5" style={{ color: status.color }} />}
                        {status.name}
                      </span>
                    ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">Inconnu</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      // onClick={() => handleEditTask(task.id)} // Placeholder for edit
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1 rounded-md hover:bg-primary-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Modifier (non implémenté)"
                      disabled // Remove disabled when implemented
                    >
                      <Icons.Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-gray-700"
                      title="Supprimer"
                    >
                      <Icons.Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
