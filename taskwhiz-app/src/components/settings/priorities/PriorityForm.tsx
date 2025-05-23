import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/app.store';
import type { Priority, PriorityId } from '../../../types';
import { generateId } from '../../../utils/helpers';
import * as Icons from 'lucide-react'; // Import all icons

interface PriorityFormProps {
  priorityId?: PriorityId | null;
  onClose: () => void;
  onSave: () => void; // To refresh list or handle successful save
}

const PriorityForm: React.FC<PriorityFormProps> = ({ priorityId, onClose, onSave }) => {
  const { priorities, addPriority, updatePriority } = useAppStore((state) => ({
    priorities: state.priorities.data,
    addPriority: state.addPriority,
    updatePriority: state.updatePriority,
  }));

  const [name, setName] = useState('');
  const [color, setColor] = useState('#CCCCCC');
  const [icon, setIcon] = useState<keyof typeof Icons | ''>(''); // Use keyof typeof Icons for icon names
  const [order, setOrder] = useState(0);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = priorityId !== null && priorityId !== undefined;

  useEffect(() => {
    if (isEditing && priorities[priorityId]) {
      const priorityToEdit = priorities[priorityId];
      setName(priorityToEdit.name);
      setColor(priorityToEdit.color);
      setIcon((priorityToEdit.icon as keyof typeof Icons) || '');
      setOrder(priorityToEdit.order);
      setDescription(priorityToEdit.description || '');
      setIsActive(priorityToEdit.isActive);
    } else {
      // Set default order for new priority
      const existingOrders = Object.values(priorities).map(p => p.order);
      setOrder(existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1);
    }
  }, [priorityId, priorities, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Le nom de la priorité est requis.');
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
    if (icon && !(icon in Icons)) {
        setErrorMessage("L'icône spécifiée n'est pas valide. Laissez vide ou utilisez un nom d'icône Lucide valide (ex: 'Activity').");
        return;
    }


    setErrorMessage('');
    const now = Date.now();

    if (isEditing) {
      const updatedPriority: Priority = {
        id: priorityId!,
        name: name.trim(),
        color: color.trim(),
        icon: icon || undefined,
        order: Number(order),
        description: description.trim() || undefined,
        isActive,
        createdAt: priorities[priorityId!].createdAt, // Keep original creation date
        updatedAt: now,
      };
      updatePriority(updatedPriority);
    } else {
      const newPriority: Priority = {
        id: generateId() as PriorityId,
        name: name.trim(),
        color: color.trim(),
        icon: icon || undefined,
        order: Number(order),
        description: description.trim() || undefined,
        isActive,
        createdAt: now,
        updatedAt: now,
      };
      addPriority(newPriority);
    }
    onSave(); // Call onSave to trigger list refresh or other actions
    onClose(); // Close the form/modal
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          {isEditing ? 'Modifier la Priorité' : 'Ajouter une Priorité'}
        </h2>
        {errorMessage && <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 p-3 rounded-md mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="priority-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="priority-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Couleur <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                    type="color"
                    id="priority-color-picker"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-10 p-0 border-none cursor-pointer rounded-md shadow-sm dark:bg-gray-700"
                />
                <input
                    type="text"
                    id="priority-color-hex"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#RRGGBB"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    className="ml-2 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="priority-icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Icône (Lucide)
              </label>
              <input
                type="text"
                id="priority-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value as keyof typeof Icons | '')}
                placeholder="Ex: Activity, AlertTriangle"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="priority-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ordre <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="priority-order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value, 10))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="priority-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="priority-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              id="priority-isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-primary-600 dark:text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
            />
            <label htmlFor="priority-isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Active
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

export default PriorityForm;
