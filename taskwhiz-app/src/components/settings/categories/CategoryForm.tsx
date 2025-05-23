import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/app.store';
import type { Category, CategoryId, PriorityId, ProjectId } from '../../../types';
import { generateId } from '../../../utils/helpers';
import * as Icons from 'lucide-react';
import { getIconName } from '../../../utils/icon.utils';

interface CategoryFormProps {
  categoryId?: CategoryId | null;
  onClose: () => void;
  onSave: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, onClose, onSave }) => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    priorities, 
    projects,
    currentUserId 
  } = useAppStore((state) => ({
    categories: state.categories.data,
    addCategory: state.addCategory,
    updateCategory: state.updateCategory,
    priorities: Object.values(state.priorities.data).sort((a,b) => a.order - b.order),
    projects: Object.values(state.projects.data).sort((a,b) => a.name.localeCompare(b.name)), // Assuming projects have a name
    currentUserId: state.uiState.currentUser,
  }));

  const [name, setName] = useState('');
  const [color, setColor] = useState('#CCCCCC');
  const [icon, setIcon] = useState<keyof typeof Icons | ''>('');
  const [order, setOrder] = useState(0);
  const [description, setDescription] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<CategoryId | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [defaultPriorityId, setDefaultPriorityId] = useState<PriorityId | undefined>(undefined);
  const [defaultProjectId, setDefaultProjectId] = useState<ProjectId | undefined>(undefined);
  const [suggestedIcon, setSuggestedIcon] = useState<keyof typeof Icons | ''>('');
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = categoryId !== null && categoryId !== undefined;

  useEffect(() => {
    if (isEditing && categories[categoryId]) {
      const catToEdit = categories[categoryId];
      setName(catToEdit.name);
      setColor(catToEdit.color);
      setIcon(catToEdit.icon as keyof typeof Icons);
      setOrder(catToEdit.order);
      setDescription(catToEdit.description || '');
      setParentCategoryId(catToEdit.parentCategoryId);
      setIsActive(catToEdit.isActive);
      setDefaultPriorityId(catToEdit.defaultPriorityId);
      setDefaultProjectId(catToEdit.defaultProjectId);
    } else {
      const existingOrders = Object.values(categories).map(c => c.order);
      setOrder(existingOrders.length > 0 ? Math.max(...existingOrders) + 1 : 1);
    }
  }, [categoryId, categories, isEditing]);

  useEffect(() => {
    if (name && !isEditing && !icon) { // Suggest icon only for new categories if icon is not already set
      const suggIcon = getIconName(name, 'category') as keyof typeof Icons | '';
      setSuggestedIcon(suggIcon);
    } else {
      setSuggestedIcon('');
    }
  }, [name, isEditing, icon]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Le nom de la catégorie est requis.');
      return;
    }
    if (!color.trim()) {
      setErrorMessage('La couleur est requise.');
      return;
    }
     if (!icon.trim() || !(icon in Icons)) {
      setErrorMessage("L'icône est requise et doit être un nom d'icône Lucide valide (ex: 'Bug').");
      return;
    }
    if (order === null || isNaN(order)) {
      setErrorMessage("L'ordre est requis et doit être un nombre.");
      return;
    }
    if (!currentUserId) {
      setErrorMessage("Utilisateur non identifié.");
      return;
    }
    if (isEditing && categoryId === parentCategoryId) {
        setErrorMessage("Une catégorie ne peut pas être son propre parent.");
        return;
    }


    setErrorMessage('');
    const now = Date.now();

    const categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> = {
      name: name.trim(),
      color: color.trim(),
      icon: icon as keyof typeof Icons,
      order: Number(order),
      description: description.trim() || undefined,
      parentCategoryId: parentCategoryId || undefined,
      isActive,
      defaultPriorityId: defaultPriorityId || undefined,
      defaultProjectId: defaultProjectId || undefined,
      createdBy: currentUserId, 
    };

    if (isEditing && categoryId) {
      updateCategory({ 
        ...categories[categoryId], 
        ...categoryData,
        updatedAt: now 
      });
    } else {
      addCategory({
        id: generateId() as CategoryId,
        ...categoryData,
        createdAt: now,
        updatedAt: now,
      });
    }
    onSave();
    onClose();
  };
  
  const availableParentCategories = Object.values(categories).filter(cat => cat.id !== categoryId);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          {isEditing ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
        </h2>
        {errorMessage && <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 p-3 rounded-md mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom <span className="text-red-500">*</span></label>
            <input type="text" id="cat-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full input-class" />
            {suggestedIcon && !icon && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Icône suggérée: <button type="button" className="text-primary-600 dark:text-primary-400 hover:underline" onClick={() => setIcon(suggestedIcon)}>{suggestedIcon}</button>
                </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cat-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Couleur <span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <input type="color" id="cat-color-picker" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-10 p-0 border-none cursor-pointer rounded-md shadow-sm dark:bg-gray-700"/>
                <input type="text" id="cat-color-hex" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#RRGGBB" pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" className="ml-2 block w-full input-class"/>
              </div>
            </div>
            <div>
              <label htmlFor="cat-icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Icône (Lucide) <span className="text-red-500">*</span></label>
              <input type="text" id="cat-icon" value={icon} onChange={(e) => setIcon(e.target.value as keyof typeof Icons | '')} placeholder="Ex: Bug, Sparkles" className="mt-1 block w-full input-class"/>
            </div>
          </div>

          <div>
            <label htmlFor="cat-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ordre <span className="text-red-500">*</span></label>
            <input type="number" id="cat-order" value={order} onChange={(e) => setOrder(parseInt(e.target.value, 10))} className="mt-1 block w-full input-class"/>
          </div>
          
          <div>
            <label htmlFor="cat-parent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie Parente</label>
            <select id="cat-parent" value={parentCategoryId || ''} onChange={(e) => setParentCategoryId(e.target.value as CategoryId || undefined)} className="mt-1 block w-full input-class">
              <option value="">Aucune</option>
              {availableParentCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cat-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea id="cat-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full input-class"/>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="cat-default-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priorité par Défaut</label>
                <select id="cat-default-priority" value={defaultPriorityId || ''} onChange={(e) => setDefaultPriorityId(e.target.value as PriorityId || undefined)} className="mt-1 block w-full input-class">
                    <option value="">Aucune</option>
                    {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="cat-default-project" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Projet par Défaut</label>
                <select id="cat-default-project" value={defaultProjectId || ''} onChange={(e) => setDefaultProjectId(e.target.value as ProjectId || undefined)} className="mt-1 block w-full input-class" disabled={projects.length === 0}>
                    <option value="">Aucun</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                 {projects.length === 0 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aucun projet disponible.</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input id="cat-isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary-600 dark:text-primary-500 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"/>
            <label htmlFor="cat-isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              <Icons.XCircle className="h-5 w-5 mr-2" />Annuler
            </button>
            <button type="submit" className="btn-primary">
              <Icons.Save className="h-5 w-5 mr-2" />{isEditing ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Helper for input classes to avoid repetition - can be expanded
const inputClass = "mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm";
// Replace className="..." for inputs/selects/textareas with className={inputClass}

export default CategoryForm;
