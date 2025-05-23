import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/app.store';
import type { Status, StatusId } from '../../../types';
import * as Icons from 'lucide-react';
import StatusForm from './StatusForm';

const StatusList: React.FC = () => {
  const { statusesMap, deleteStatus, loadDefaultStatuses, allStatusesArray } = useAppStore((state) => ({
    statusesMap: state.statuses.data,
    deleteStatus: state.deleteStatus,
    loadDefaultStatuses: state.loadDefaultStatuses,
    allStatusesArray: Object.values(state.statuses.data).sort((a, b) => a.order - b.order),
  }));

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<StatusId | null>(null);

  useEffect(() => {
    if (allStatusesArray.length === 0) {
      loadDefaultStatuses();
    }
  }, [allStatusesArray.length, loadDefaultStatuses]);

  const handleAddStatus = () => {
    setEditingStatusId(null);
    setIsFormOpen(true);
  };

  const handleEditStatus = (statusId: StatusId) => {
    setEditingStatusId(statusId);
    setIsFormOpen(true);
  };

  const handleDeleteStatus = (statusId: StatusId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce statut ? Cela pourrait affecter les tâches existantes.')) {
      deleteStatus(statusId);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingStatusId(null);
  };

  const handleFormSave = () => {
    // List re-renders due to store update
  };

  const getIconComponent = (iconName?: string): React.ReactNode => {
    if (!iconName) return <Icons.HelpCircle className="h-5 w-5 text-gray-400" title="Icône non spécifiée"/>;
    const IconComponent = (Icons as any)[iconName as keyof typeof Icons];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Icons.HelpCircle className="h-5 w-5 text-gray-400" title={`Icône "${iconName}" non trouvée`}/>;
  };

  const getAllowedTransitionNames = (transitionIds?: StatusId[]): string => {
    if (!transitionIds || transitionIds.length === 0) return '-';
    return transitionIds
      .map(id => statusesMap[id]?.name || 'Inconnu')
      .join(', ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Gestion des Statuts</h2>
        <button
          onClick={handleAddStatus}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 flex items-center"
        >
          <Icons.PlusCircle className="h-5 w-5 mr-2" />
          Ajouter un Statut
        </button>
      </div>

      {allStatusesArray.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun statut défini. Cliquez sur "Ajouter un Statut" pour commencer.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ordre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Icône</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Couleur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actif</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider max-w-xs">Transitions Autorisées</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {allStatusesArray.map((status) => (
                <tr key={status.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{status.order}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getIconComponent(status.icon)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{status.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <span
                        className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: status.color }}
                        title={status.color}
                      ></span>
                      <span className="ml-2 hidden sm:inline">{status.color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{status.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {status.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                        Oui
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
                        Non
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs" title={getAllowedTransitionNames(status.allowedTransitions)}>
                    {getAllowedTransitionNames(status.allowedTransitions)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditStatus(status.id)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1 rounded-md hover:bg-primary-100 dark:hover:bg-gray-700"
                      title="Modifier"
                    >
                      <Icons.Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStatus(status.id)}
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
        <StatusForm
          statusId={editingStatusId}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default StatusList;
