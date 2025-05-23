import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/app.store';
import type { Status, StatusId } from '../../../types';
import { generateId } from '../../../utils/helpers';
import * as Icons from 'lucide-react';

interface StatusFormProps {
  statusId?: StatusId | null;
  onClose: () => void;
  onSave: () => void;
}

const statusTypes: Status['type'][] = ['todo', 'progress', 'review', 'done', 'cancelled'];

const StatusForm: React.FC<StatusFormProps> = ({ statusId, onClose, onSave }) => {
  const { statuses, addStatus, updateStatus, allStatuses } = useAppStore((state) => ({
    statuses: state.statuses.data,
    addStatus: state.addStatus,
    updateStatus: state.updateStatus,
    allStatuses: Object.values(state.statuses.data), // For allowedTransitions selector
  }));

  const [name, setName] = useState('');
  const [color, setColor] = useState('#CCCCCC');
  const [icon, setIcon] = useState<keyof typeof Icons | ''>('');
  const [order, setOrder] = useState(0);
  const [type, setType] = useState<Status['type']>('todo');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [allowedTransitions, setAllowedTransitions] = useState<StatusId[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = statusId !== null && statusId !== undefined;

  useEffect(() => {
    if (isEditing && statuses[statusId]) {
      const statusToEdit = statuses[statusId];
      setName(statusToEdit.name);
      setColor(statusToEdit.color);
      setIcon(statusToEdit.icon as keyof typeof Icons);
      setOrder(statusToEdit.order);
      setType(statusToEdit.type);
      setDescription(statusToEdit.description || '');
      setIsActive(statusToEdit.isActive);
      setAllowedTransitions(statusToEdit.allowedTransitions || []);
    } else {
      const existingOrders = Object.values(statuses).map(s => s.order);
      setOrder(existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1);
      setAllowedTransitions([]); // Reset for new status
    }
  }, [statusId, statuses, isEditing]);

  const handleAllowedTransitionChange = (selectedStatusId: StatusId) => {
    setAllowedTransitions((prev) =>
      prev.includes(selectedStatusId)
        ? prev.filter((id) => id !== selectedStatusId)
        : [...prev, selectedStatusId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Le nom du statut est requis.');
      return;
    }
    if (!color.trim()) {
      setErrorMessage('La couleur est requise.');
      return;
    }
    if (order === null || isNaN(order)) {
      setErrorMessage("L'ordre est requis et doit être un nombre.");
      return;
    }
    if (!icon || !(icon in Icons)) {
      setErrorMessage("L'icône est requise et doit être un nom d'icône Lucide valide (ex: 'Activity').");
      return;
    }
    if (!type) {
      setErrorMessage("Le type de statut est requis.");
      return;
    }

    setErrorMessage('');
    const now = Date.now();

    if (isEditing) {
      const updatedStatus: Status = {
        id: statusId!,
        name: name.trim(),
        color: color.trim(),
        icon: icon as keyof typeof Icons,
        order: Number(order),
        type,
        description: description.trim() || undefined,
        isActive,
        allowedTransitions,
        createdAt: statuses[statusId!].createdAt,
        updatedAt: now,
      };
      updateStatus(updatedStatus);
    } else {
      const newStatus: Status = {
        id: generateId() as StatusId,
        name: name.trim(),
        color: color.trim(),
        icon: icon as keyof typeof Icons,
        order: Number(order),
        type,
        description: description.trim() || undefined,
        isActive,
        allowedTransitions,
        createdAt: now,
        updatedAt: now,
      };
      addStatus(newStatus);
    }
    onSave();
    onClose();
  };
  
  const availableTransitions = allStatuses.filter(s => s.id !== statusId); // Cannot transition to self

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          {isEditing ? 'Modifier le Statut' : 'Ajouter un Statut'}
        </h2>
        {errorMessage && <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 p-3 rounded-md mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="status-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="status-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Couleur <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="status-color-picker"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-10 p-0 border-none cursor-pointer rounded-md shadow-sm dark:bg-gray-700"
                />
                <input
                  type="text"
                  id="status-color-hex"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#RRGGBB"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  className="ml-2 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="status-icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Icône (Lucide) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="status-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value as keyof typeof Icons | '')}
                placeholder="Ex: Activity, AlertTriangle"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ordre <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="status-order"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="status-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="status-type"
                value={type}
                onChange={(e) => setType(e.target.value as Status['type'])}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                {statusTypes.map((st) => (
                  <option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="status-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="status-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transitions Autorisées
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2 space-y-1 bg-white dark:bg-gray-700">
              {availableTransitions.length > 0 ? availableTransitions.map((s) => (
                <div key={s.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`transition-${s.id}`}
                    checked={allowedTransitions.includes(s.id)}
                    onChange={() => handleAllowedTransitionChange(s.id)}
                    className="h-4 w-4 text-primary-600 dark:text-primary-500 border-gray-300 dark:border-gray-500 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                  />
                  <label htmlFor={`transition-${s.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {s.name}
                  </label>
                </div>
              )) : <p className="text-xs text-gray-500 dark:text-gray-400">Aucun autre statut disponible pour la transition.</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="status-isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-primary-600 dark:text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
            />
            <label htmlFor="status-isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Actif
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <Icons.XCircle className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              <Icons.Save className="h-5 w-5 mr-2" />
              {isEditing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusForm;
