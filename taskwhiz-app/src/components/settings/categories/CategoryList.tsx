import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store/app.store';
import type { Category, CategoryId } from '../../../types';
import * as Icons from 'lucide-react';
import CategoryForm from './CategoryForm';

const CategoryList: React.FC = () => {
  const { categoriesMap, deleteCategory, loadDefaultCategories, allCategoriesArray } = useAppStore((state) => ({
    categoriesMap: state.categories.data,
    deleteCategory: state.deleteCategory,
    loadDefaultCategories: state.loadDefaultCategories,
    allCategoriesArray: Object.values(state.categories.data).sort((a, b) => a.order - b.order),
  }));

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<CategoryId | null>(null);

  useEffect(() => {
    if (allCategoriesArray.length === 0) {
      loadDefaultCategories();
    }
  }, [allCategoriesArray.length, loadDefaultCategories]);

  const handleAddCategory = () => {
    setEditingCategoryId(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (categoryId: CategoryId) => {
    setEditingCategoryId(categoryId);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (categoryId: CategoryId) => {
    // Check for child categories
    const children = allCategoriesArray.filter(cat => cat.parentCategoryId === categoryId);
    if (children.length > 0) {
      if (!window.confirm('Cette catégorie a des sous-catégories. Les supprimer les rendra orphelines. Continuer ?')) {
        return;
      }
    } else if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }
    deleteCategory(categoryId);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategoryId(null);
  };

  const handleFormSave = () => {
    // List re-renders due to store update
  };

  const getIconComponent = (iconName?: string): React.ReactNode => {
    if (!iconName) return <Icons.HelpCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" title="Icône non spécifiée"/>;
    const IconComponent = (Icons as any)[iconName as keyof typeof Icons];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Icons.HelpCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" title={`Icône "${iconName}" non trouvée`}/>;
  };
  
  const getParentCategoryName = (parentCategoryId?: CategoryId): string => {
    if (!parentCategoryId) return '-';
    return categoriesMap[parentCategoryId]?.name || 'Inconnu';
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Gestion des Catégories</h2>
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 flex items-center"
        >
          <Icons.PlusCircle className="h-5 w-5 mr-2" />
          Ajouter une Catégorie
        </button>
      </div>

      {allCategoriesArray.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune catégorie définie. Cliquez sur "Ajouter une Catégorie" pour commencer.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ordre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Icône</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Couleur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Parent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {allCategoriesArray.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{category.order}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getIconComponent(category.icon)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <span
                        className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: category.color }}
                        title={category.color}
                      ></span>
                      <span className="ml-2 hidden sm:inline">{category.color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getParentCategoryName(category.parentCategoryId)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {category.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                        Oui
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
                        Non
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditCategory(category.id)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1 rounded-md hover:bg-primary-100 dark:hover:bg-gray-700"
                      title="Modifier"
                    >
                      <Icons.Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
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
        <CategoryForm
          categoryId={editingCategoryId}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default CategoryList;
