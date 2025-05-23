import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getIconName } from '../utils/icon.utils'; // Ensure getIconName is imported at the top
import type {
  AppState,
  UiState,
  FilterState,
  AiState,
  MetaState,
  SessionState,
  Priority,
  Status,
  Category,
  Project,
  Tag,
  User,
  Task,
  SubTask,
  CheckList,
  CheckListItem,
  Attachment,
  CustomTheme,
  SavedFilter,
  AISuggestion,
  AutomationRule,
  AIConversation,
  Backup,
  AppStatistics,
  UserPreferences,
  UserStatistics as UserStatsType, // Renamed to avoid conflict with UserStatistics from user.types.ts if any
  KanbanColumn,
  ViewConfig,
  DashboardWidget,
} from '../types'; // Assuming all types are exported from a central index.ts in types or directly
import {
  TaskId,
  SubTaskId,
  CheckListId,
  CheckListItemId,
  AttachmentId,
  PriorityId,
  StatusId,
  CategoryId,
  ProjectId,
  TagId,
  UserId,
  ThemeId,
  KanbanColumnId,
  WidgetId,
  FilterId,
  SavedFilterId,
  AISuggestionId,
  AutomationRuleId,
  AIConversationId,
  BackupId,
  Timestamp,
} from '../types/common.types'; // Import specific ID types

// Define the initial state according to AppState
const initialUiState: UiState = {
  currentThemeId: 'system',
  customThemes: { data: {}, isLoading: false, error: null },
  isSidebarCollapsed: false,
  activeView: null,
  availableViews: { data: {}, isLoading: false, error: null },
  dashboardLayout: [],
  kanbanColumns: { data: {}, isLoading: false, error: null },
  listViewConfigs: {},
  modals: {},
  popovers: {},
  notifications: [],
  isCommandPaletteOpen: false,
  commandPaletteActions: [],
  globalLoadingIndicator: { isLoading: false },
  contextMenu: { isOpen: false, items: [], position: { x: 0, y: 0 } },
  dragAndDropState: { isDragging: false },
  windowFocus: true,
  isOnline: true,
  fontSize: 'medium',
  lastError: undefined,
  currentUser: null, // Added currentUser
};

const initialFilterState: FilterState = {
  globalFilters: [],
  viewFilters: {},
  savedFilters: { data: {}, isLoading: false, error: null },
  quickFilterSettings: {
    quickFilters: [],
    searchableFields: [],
    smartFilters: [],
  },
  currentSearchTerm: '',
  recentSearches: [],
};

const initialAiState: AiState = {
  aiSuggestions: { data: {}, isLoading: false, error: null },
  automationRules: { data: {}, isLoading: false, error: null },
  aiConversations: { data: {}, isLoading: false, error: null },
  isAiAssistantEnabled: true, // Default to true, can be changed by user
  aiModelInUse: 'default-model',
  aiTokenUsage: { sessionTokens: 0, totalTokensSinceLastReset: 0 },
  aiFeatureSettings: {},
};

const initialMetaState: MetaState = {
  appVersion: '1.0.0', // Example version
  lastBackupAt: undefined,
  backups: { data: {}, isLoading: false, error: null },
  appStatistics: { data: null, isLoading: false, error: null },
  syncState: { isSyncing: false },
  featureFlags: {},
  serverStatus: 'online',
  databaseInfo: { type: 'localforage' }, // Assuming localforage is the target
};

const initialSessionState: SessionState = {
  currentUser: { data: null, isLoading: false, error: null },
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastActivityAt: Date.now(),
};

const initialState: AppState = {
  // Data Collections
  tasks: { data: {}, isLoading: false, error: null },
  subTasks: { data: {}, isLoading: false, error: null },
  checkLists: { data: {}, isLoading: false, error: null },
  checkListItems: { data: {}, isLoading: false, error: null },
  checkListActions: { data: {}, isLoading: false, error: null },
  attachments: { data: {}, isLoading: false, error: null },
  priorities: { data: {}, isLoading: false, error: null },
  statuses: { data: {}, isLoading: false, error: null },
  categories: { data: {}, isLoading: false, error: null },
  projects: { data: {}, isLoading: false, error: null },
  tags: { data: {}, isLoading: false, error: null },
  users: { data: {}, isLoading: false, error: null },
  userPreferences: { data: null, isLoading: false, error: null },
  userStatistics: { data: null, isLoading: false, error: null },

  // UI, Filter, AI, Meta, Session States
  uiState: initialUiState,
  filterState: initialFilterState,
  aiState: initialAiState,
  metaState: initialMetaState,
  sessionState: initialSessionState,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // --- Actions ---

      // UI Actions
      setTheme: (themeId: ThemeId | 'system') =>
        set((state) => ({
          uiState: { ...state.uiState, currentThemeId: themeId },
        })),
      toggleSidebar: () =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            isSidebarCollapsed: !state.uiState.isSidebarCollapsed,
          },
        })),
      
      // Example Collection Action (Priority)
      addPriority: (priority: Priority) =>
        set((state) => ({
          priorities: {
            ...state.priorities,
            data: {
              ...state.priorities.data,
              [priority.id]: priority,
            },
          },
        })),
      updatePriority: (priority: Priority) =>
        set((state) => ({
          priorities: {
            ...state.priorities,
            data: {
              ...state.priorities.data,
              [priority.id]: {
                ...(state.priorities.data[priority.id] || {}),
                ...priority,
              }
            }
          }
        })),
      deletePriority: (priorityId: PriorityId) =>
        set((state) => {
          const newData = { ...state.priorities.data };
          delete newData[priorityId];
          return {
            priorities: {
              ...state.priorities,
              data: newData,
            },
          };
        }),
      loadDefaultPriorities: () =>
        set((state) => {
import { getIconName } from '../utils/icon.utils'; // Import getIconName

// ... (other imports and existing code) ...

// In the persist callback:
// ... (existing actions) ...

      deletePriority: (priorityId: PriorityId) =>
        set((state) => {
          const newData = { ...state.priorities.data };
          delete newData[priorityId];
          return {
            priorities: {
              ...state.priorities,
              data: newData,
            },
          };
        }),
      loadDefaultPriorities: () =>
        set((state) => {
          if (Object.keys(state.priorities.data).length === 0) {
            const now = Date.now();
            const defaultPriorityDefinitions = [
              { name: 'Urgente', color: '#FF4444', order: 1, description: 'Priorité critique' },
              { name: 'Haute', color: '#FF8800', order: 2, description: 'Priorité élevée' },
              { name: 'Moyenne', color: '#0088FF', order: 3, description: 'Priorité normale' },
              { name: 'Basse', color: '#00CC44', order: 4, description: 'Priorité faible' },
            ];

            const defaultPriorities: Priority[] = defaultPriorityDefinitions.map((p, index) => ({
              id: `default-${p.name.toLowerCase().replace(/\s+/g, '-')}` as PriorityId,
              name: p.name,
              color: p.color,
              icon: getIconName(p.name, 'priority') || 'HelpCircle', // Use getIconName
              order: p.order,
              description: p.description,
              isActive: true,
              createdAt: now,
              updatedAt: now,
              isDefault: true,
            }));
            
            const prioritiesData = defaultPriorities.reduce((acc, priority) => {
              acc[priority.id] = priority;
              return acc;
            }, {} as Record<PriorityId, Priority>);
            return {
              priorities: {
                ...state.priorities,
                data: prioritiesData,
                isLoading: false,
                error: null,
              },
            };
          }
          return state; // No change if priorities already exist
        }),
      
      // Placeholder for other CRUD actions - to be expanded later
      // Tasks
      addTask: (task: Task) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            data: {
              ...state.tasks.data,
              [task.id]: task,
            },
          },
        })),
      updateTask: (task: Task) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            data: {
              ...state.tasks.data,
              [task.id]: {
                ...(state.tasks.data[task.id] || {}), // Preserve existing fields not being updated
                ...task, // Apply new field values
              },
            },
          },
        })),
      deleteTask: (taskId: TaskId) =>
        set((state) => {
          const newData = { ...state.tasks.data };
          delete newData[taskId];
          return {
            tasks: {
              ...state.tasks,
              data: newData,
            },
          };
        }),

      // Statuses
      addStatus: (status: Status) =>
        set((state) => ({
          statuses: {
            ...state.statuses,
            data: {
              ...state.statuses.data,
              [status.id]: status,
            },
          },
        })),
      updateStatus: (status: Status) =>
        set((state) => ({
          statuses: {
            ...state.statuses,
            data: {
              ...state.statuses.data,
              [status.id]: {
                ...(state.statuses.data[status.id] || {}),
                ...status,
              },
            },
          },
        })),
      deleteStatus: (statusId: StatusId) =>
        set((state) => {
          const newData = { ...state.statuses.data };
          delete newData[statusId];
          // Also remove this statusId from any allowedTransitions in other statuses
          const updatedStatuses = { ...newData };
          Object.values(updatedStatuses).forEach(s => {
            if (s.allowedTransitions?.includes(statusId)) {
              updatedStatuses[s.id] = {
                ...s,
                allowedTransitions: s.allowedTransitions.filter(id => id !== statusId),
                updatedAt: Date.now(),
              };
            }
          });
          return {
            statuses: {
              ...state.statuses,
              data: updatedStatuses,
            },
          };
        }),
      loadDefaultStatuses: () =>
        set((state) => {
          if (Object.keys(state.statuses.data).length === 0) {
            const now = Date.now();
            
            const defaultStatusDefinitions = [
              { name: 'À faire', color: '#6B7280', order: 1, type: 'todo' as Status['type'], description: 'Tâche non commencée.' },
              { name: 'En cours', color: '#3B82F6', order: 2, type: 'progress' as Status['type'], description: 'Tâche en cours de réalisation.' },
              { name: 'En révision', color: '#F59E0B', order: 3, type: 'review' as Status['type'], description: 'Tâche en attente de validation.' },
              { name: 'Terminé', color: '#10B981', order: 4, type: 'done' as Status['type'], description: 'Tâche complétée.', isCompletedStatus: true },
              { name: 'Annulé', color: '#EF4444', order: 5, type: 'cancelled' as Status['type'], description: 'Tâche annulée.', isArchivedStatus: true },
            ];

            const tempStatuses: Partial<Record<StatusId, Status>> = {};
            const ids: Record<string, StatusId> = {};

            defaultStatusDefinitions.forEach(s => {
              const id = `default-${s.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}` as StatusId;
              ids[s.name] = id;
              tempStatuses[id] = {
                id,
                name: s.name,
                color: s.color,
                icon: getIconName(s.name, 'status') || 'HelpCircle', // Use getIconName
                order: s.order,
                type: s.type,
                description: s.description,
                isActive: true,
                createdAt: now,
                updatedAt: now,
                isDefault: true,
                isCompletedStatus: s.isCompletedStatus || false,
                isArchivedStatus: s.isArchivedStatus || false,
                allowedTransitions: [], // Will be populated next
              };
            });
            
            // Define allowed transitions using the generated IDs
            if (tempStatuses[ids['À faire']]) tempStatuses[ids['À faire']]!.allowedTransitions = [ids['En cours'], ids['Annulé']];
            if (tempStatuses[ids['En cours']]) tempStatuses[ids['En cours']]!.allowedTransitions = [ids['En révision'], ids['Terminé'], ids['Annulé'], ids['À faire']];
            if (tempStatuses[ids['En révision']]) tempStatuses[ids['En révision']]!.allowedTransitions = [ids['En cours'], ids['Terminé'], ids['Annulé']];
            if (tempStatuses[ids['Terminé']]) tempStatuses[ids['Terminé']]!.allowedTransitions = [ids['En cours']]; // Or none, or back to 'In Progress'
            if (tempStatuses[ids['Annulé']]) tempStatuses[ids['Annulé']]!.allowedTransitions = [ids['À faire']];


            const statusesData = tempStatuses as Record<StatusId, Status>;
            
            return {
              statuses: {
                ...state.statuses,
                data: statusesData,
                isLoading: false,
                error: null,
              },
            };
          }
          return state; // No change if statuses already exist
        }),
      
      // Category Actions
      addCategory: (category: Category) =>
        set((state) => ({
          categories: {
            ...state.categories,
            data: {
              ...state.categories.data,
              [category.id]: category,
            },
          },
        })),
      updateCategory: (category: Category) =>
        set((state) => ({
          categories: {
            ...state.categories,
            data: {
              ...state.categories.data,
              [category.id]: {
                ...(state.categories.data[category.id] || {}),
                ...category,
              },
            },
          },
        })),
      deleteCategory: (categoryId: CategoryId) =>
        set((state) => {
          const newData = { ...state.categories.data };
          delete newData[categoryId];
          // Orphan children - no specific action needed here for that strategy
          // If we needed to clear parentCategoryId from children:
          // Object.values(newData).forEach(cat => {
          //   if (cat.parentCategoryId === categoryId) {
          //     newData[cat.id] = { ...cat, parentCategoryId: undefined, updatedAt: Date.now() };
          //   }
          // });
          return {
            categories: {
              ...state.categories,
              data: newData,
            },
          };
        }),
      loadDefaultCategories: () =>
        set((state) => {
          if (Object.keys(state.categories.data).length === 0) {
            const now = Date.now();
            const currentUserId = state.uiState.currentUser; // Assuming current user is set
            if (!currentUserId) {
              console.warn("Cannot load default categories: current user not set.");
              return state; // Or handle as an error / specific state
            }

            const defaultCategoryDefinitions = [
              { name: 'Bug', color: '#E53E3E', order: 1 },
              { name: 'Feature Request', color: '#4299E1', order: 2 },
              { name: 'Design', color: '#9F7AEA', order: 3 },
              { name: 'Documentation', color: '#4FD1C5', order: 4 },
            ];

            const defaultCategories: Category[] = defaultCategoryDefinitions.map(cat => ({
              id: `default-${cat.name.toLowerCase().replace(/\s+/g, '-')}` as CategoryId,
              name: cat.name,
              color: cat.color,
              icon: getIconName(cat.name, 'category') || 'HelpCircle',
              order: cat.order,
              isActive: true,
              createdAt: now,
              updatedAt: now,
              createdBy: currentUserId,
            }));
            
            const categoriesData = defaultCategories.reduce((acc, category) => {
              acc[category.id] = category;
              return acc;
            }, {} as Record<CategoryId, Category>);
            
            return {
              categories: {
                ...state.categories,
                data: categoriesData,
                isLoading: false,
                error: null,
              },
            };
          }
          return state;
        }),
      // ... and so on for Projects, Tags

      // User Actions
      addUser: (user: User) =>
        set((state) => ({
          users: {
            ...state.users,
            data: {
              ...state.users.data,
              [user.id]: user,
            },
          },
        })),
      setCurrentUser: (userId: UserId | null) =>
        set((state) => ({
          uiState: { ...state.uiState, currentUser: userId },
        })),
      updateUser: (user: User) =>
        set((state) => ({
          users: {
            ...state.users,
            data: {
              ...state.users.data,
              [user.id]: {
                ...(state.users.data[user.id] || {}),
                ...user,
              },
            },
          },
        })),
      deleteUser: (userId: UserId) =>
        set((state) => {
          const newData = { ...state.users.data };
          delete newData[userId];
          return {
            users: {
              ...state.users,
              data: newData,
            },
          };
        }),

    }),
    {
      name: 'taskwhiz-storage', // Storage name
      version: 1, // Initial version
      storage: createJSONStorage(() => localStorage), // Using localStorage
      partialize: (state) => ({
        // Selecting parts of the state to persist
        tasks: state.tasks,
        subTasks: state.subTasks,
        checkLists: state.checkLists,
        checkListItems: state.checkListItems,
        // checkListActions: state.checkListActions, // Usually not persisted
        attachments: state.attachments, // May need careful consideration for large files or external links
        priorities: state.priorities,
        statuses: state.statuses,
        categories: state.categories,
        projects: state.projects,
        tags: state.tags,
        users: state.users, // Persist users, but sensitive data should be handled carefully
        userPreferences: state.userPreferences,
        userStatistics: state.userStatistics, // User stats might be better re-calculated or fetched
        uiState: { // Persist most UI settings
          ...state.uiState,
          // Exclude transient UI states like modals, popovers, notifications, loading indicators, contextMenu, dragAndDropState
          modals: {},
          popovers: {},
          notifications: [],
          globalLoadingIndicator: { isLoading: false },
          contextMenu: { isOpen: false, items: [], position: {x:0, y:0}},
          dragAndDropState: { isDragging: false },
          lastError: undefined,
        },
        filterState: state.filterState, // Persist filters
        aiState: { // Persist AI settings, but perhaps not conversations or large suggestions
          ...state.aiState,
          aiConversations: { data: {}, isLoading: false, error: null }, // Don't persist conversations by default
          aiSuggestions: { data: {}, isLoading: false, error: null }, // Don't persist all suggestions
        },
        metaState: { // Persist some meta state
          ...state.metaState,
          syncState: { isSyncing: false }, // Don't persist active sync state
          serverStatus: 'online', // Reset to online on load
        },
        sessionState: { // Only persist necessary session info
            ...state.sessionState,
            currentUser: state.sessionState.currentUser, // Persist current user data (if not too large/sensitive for localStorage)
            isAuthenticated: state.sessionState.isAuthenticated,
            isLoading: false, // Reset loading state
            error: null, // Reset error state
        }
      }),
      migrate: (persistedState: any, version: number) => {
        // Basic migration: if version is older, reset to initial or merge carefully
        // For now, just returning the persisted state as AppState
        // Add more sophisticated migration logic as the app evolves
        // if (version < 2) {
        //   // example: remove an old deprecated field
        //   delete persistedState.someOldField;
        // }
        return persistedState as AppState;
      },
      onRehydrateStorage: (state) => {
        console.log("TaskWhiz: Hydration finished.");
        return (state, error) => {
          if (error) {
            console.error("TaskWhiz: An error occurred during rehydration:", error);
          }
        };
      },
    }
  )
);

// Exporting a selector for convenience (optional)
// export const selectTasks = (state: AppState) => state.tasks.data;
// export const selectPriorities = (state: AppState) => state.priorities.data;
// ... and so on
