import React, { useState } from 'react';
import { useAppStore } from '../../../store/app.store';
import type { Priority, PriorityId } from '../../../types';
import * as Icons from 'lucide-react'; // Import all icons
import PriorityForm from './PriorityForm'; // Assuming this will be the modal form

const PriorityList: React.FC = () => {
  const { priorities, deletePriority, loadDefaultPriorities } = useAppStore((state) => ({
    priorities: Object.values(state.priorities.data).sort((a, b) => a.order - b.order),
    deletePriority: state.deletePriority,
    loadDefaultPriorities: state.loadDefaultPriorities,
  }));

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPriorityId, setEditingPriorityId] = useState<PriorityId | null>(null);

  // Load default priorities if the list is empty (e.g., on first load)
  // This might be better placed in App.tsx or store initialization for a single call
  React.useEffect(() => {
    if (priorities.length === 0) {
      loadDefaultPriorities();
    }
  }, [priorities.length, loadDefaultPriorities]);


  const handleAddPriority = () => {
    setEditingPriorityId(null);
    setIsFormOpen(true);
  };

  const handleEditPriority = (priorityId: PriorityId) => {
    setEditingPriorityId(priorityId);
    setIsFormOpen(true);
  };

  const handleDeletePriority = (priorityId: PriorityId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette priorité ?')) {
      deletePriority(priorityId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPriorityId(null);
  };
  
  const handleFormSave = () => {
    // List will re-render due to store update, no specific action needed here usually
    // Could add a notification or specific refresh logic if required
  }

  const getIconComponent = (iconName?: string): React.ReactNode => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName as keyof typeof Icons];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Icons.HelpCircle className="h-5 w-5 text-gray-400" title="Icône non trouvée"/>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Gestion des Priorités</h2>
        <button
          onClick={handleAddPriority}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 flex items-center"
        >
          <Icons.PlusCircle className="h-5 w-5 mr-2" />
          Ajouter une Priorité
        </button>
      </div>

      {priorities.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune priorité définie. Cliquez sur "Ajouter une Priorité" pour commencer.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ordre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Icône</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Couleur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {priorities.map((priority) => (
                <tr key={priority.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{priority.order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getIconComponent(priority.icon)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{priority.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <span
                        className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: priority.color }}
                        title={priority.color}
                      ></span>
                      <span className="ml-2">{priority.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs" title={priority.description}>
                    {priority.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {priority.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                        Oui
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
                        Non
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditPriority(priority.id)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1 rounded-md hover:bg-primary-100 dark:hover:bg-gray-700"
                      title="Modifier"
                    >
                      <Icons.Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePriority(priority.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-100 dark:hover:bg-gray-700"
                      title="Supprimer"
                    >
                      <Icons.Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <PriorityForm
          priorityId={editingPriorityId}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default PriorityList;
