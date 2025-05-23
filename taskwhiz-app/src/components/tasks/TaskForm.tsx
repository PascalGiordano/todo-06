import React, { useState } from 'react';
import { useAppStore } from '../../store/app.store';
import type { Task, TaskId, PriorityId, StatusId, UserId } from '../../types';
import { generateId } from '../../utils/helpers';
import * as Icons from 'lucide-react'; // Added import for Icons

interface TaskFormProps {
  onTaskCreated?: (taskId: TaskId) => void; // Callback after task creation
  projectContextId?: string; // Optional: if creating task within a specific project context
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const { 
    priorities, 
    statuses, 
    addTask,
    currentUserId // Assuming currentUserId is available for createdBy
  } = useAppStore((state) => ({
    priorities: Object.values(state.priorities.data).sort((a,b) => a.order - b.order),
    statuses: Object.values(state.statuses.data).sort((a,b) => a.order - b.order),
    addTask: state.addTask,
    currentUserId: state.uiState.currentUser, // Get current user ID
  }));

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priorityId, setPriorityId] = useState<PriorityId>(priorities[0]?.id || '');
  const [statusId, setStatusId] = useState<StatusId>(statuses[0]?.id || '');
  const [errorMessage, setErrorMessage] = useState('');

  // Set default priority and status if available and not yet set
  React.useEffect(() => {
    if (!priorityId && priorities.length > 0) {
      setPriorityId(priorities[0].id);
    }
  }, [priorityId, priorities]);

  React.useEffect(() => {
    if (!statusId && statuses.length > 0) {
      setStatusId(statuses[0].id);
    }
  }, [statusId, statuses]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Le titre de la tâche est requis.');
      return;
    }
    if (!priorityId) {
      setErrorMessage('Veuillez sélectionner une priorité.');
      return;
    }
    if (!statusId) {
      setErrorMessage('Veuillez sélectionner un statut.');
      return;
    }
    if (!currentUserId) {
        setErrorMessage('Utilisateur non identifié. Impossible de créer la tâche.');
        // This should ideally not happen if UserSetup flow is completed.
        return;
    }

    setErrorMessage('');
    const now = Date.now();
    const newTaskId = generateId() as TaskId;

    const newTask: Task = {
      id: newTaskId,
      title: title.trim(),
      description: description.trim() || undefined,
      priorityId,
      statusId,
      categoryId: undefined, // Default
      projectId: undefined, // Default
      tags: [], // Default
      assignees: [], // Default
      dependencies: [], // Default
      subTasks: [], // Default
      checkLists: [], // Default
      attachments: [], // Default
      dueDate: undefined, // Default
      estimatedTime: undefined, // Default
      actualTimeSpent: undefined, // Default
      storyPoints: undefined, // Default
      recurringConfig: undefined, // Default
      reminderConfig: undefined, // Default
      location: undefined, // Default
      progress: 0, // Default
      customFields: {}, // Default
      commentsCount: 0, // Default
      lastActivityAt: now, // Default
      createdAt: now,
      updatedAt: now,
      createdBy: currentUserId, // Assign current user as creator
      updatedBy: undefined, // Default
      completedAt: undefined, // Default
      archivedAt: undefined, // Default
      isBillable: false, // Default
      gantt: undefined, // Default
      kanbanOrder: 0, // Default
      viewSpecificInfo: {}, // Default
      aiGeneratedContent: [], // Default
    };

    addTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    if (priorities.length > 0) setPriorityId(priorities[0].id);
    if (statuses.length > 0) setStatusId(statuses[0].id);

    if (onTaskCreated) {
      onTaskCreated(newTaskId);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Créer une Nouvelle Tâche</h2>
      {errorMessage && <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 p-3 rounded-md mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priorité <span className="text-red-500">*</span>
            </label>
            <select
              id="task-priority"
              value={priorityId}
              onChange={(e) => setPriorityId(e.target.value as PriorityId)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={priorities.length === 0}
            >
              {priorities.length === 0 && <option value="">Aucune priorité disponible</option>}
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              id="task-status"
              value={statusId}
              onChange={(e) => setStatusId(e.target.value as StatusId)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              disabled={statuses.length === 0}
            >
              {statuses.length === 0 && <option value="">Aucun statut disponible</option>}
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
            disabled={priorities.length === 0 || statuses.length === 0 || !currentUserId}
          >
            <Icons.PlusCircle className="h-5 w-5 mr-2" />
            Ajouter Tâche
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
