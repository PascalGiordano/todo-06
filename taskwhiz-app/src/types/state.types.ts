import type {
  Task,
  SubTask,
  CheckList,
  CheckListItem,
  CheckListAction,
  Attachment,
  AISuggestion as TaskAISuggestion, // Renaming to avoid conflict if AISuggestion is defined differently here
} from './task.types';
import type {
  Priority,
  Status,
  Category,
  Project,
  Tag,
} from './collection.types';
import type {
  User,
  UserPreferences,
  UserStatistics,
} from './user.types';
import type {
  CustomTheme,
  ViewType,
  DashboardWidget, // Already defined in ui.types.ts, can be used directly
  KanbanColumn,    // Already defined in ui.types.ts, can be used directly
  ListViewConfig,  // Already defined in ui.types.ts, can be used directly
  Widget,          // Already defined in ui.types.ts
  FilterSystem,    // Already defined in ui.types.ts
  UIElementState,  // Already defined in ui.types.ts (for modals etc.)
  UINotification,  // Already defined in ui.types.ts
  CommandPaletteAction, // Already defined in ui.types.ts
  Loadable,        // Already defined in ui.types.ts
  ViewConfig,      // Already defined in ui.types.ts
} from './ui.types';
import type {
  UserId,
  FilterId,
  SavedFilterId as CommonSavedFilterId, // Use common definition
  AutomationRuleId,
  AIConversationId,
  BackupId,
  Timestamp,
  LucideIconName,
  GenericConfig,
  Filter as CommonFilter, // Use common definition
  ThemeId,
} from './common.types';


// Zustand Store State Interfaces

export interface AppState {
  // Data Collections
  tasks: Loadable<Record<TaskId, Task>>;
  subTasks: Loadable<Record<SubTaskId, SubTask>>;
  checkLists: Loadable<Record<CheckListId, CheckList>>;
  checkListItems: Loadable<Record<CheckListItemId, CheckListItem>>;
  checkListActions: Loadable<Record<CheckListActionId, CheckListAction>>; // Optional, if tracking actions is needed globally
  attachments: Loadable<Record<AttachmentId, Attachment>>;
  priorities: Loadable<Record<PriorityId, Priority>>;
  statuses: Loadable<Record<StatusId, Status>>;
  categories: Loadable<Record<CategoryId, Category>>;
  projects: Loadable<Record<ProjectId, Project>>;
  tags: Loadable<Record<TagId, Tag>>;
  users: Loadable<Record<UserId, User>>; // Might only store current user or relevant users
  userPreferences: Loadable<UserPreferences | null>; // For the current user
  userStatistics: Loadable<UserStatistics | null>; // For the current user

  // UI State
  uiState: UiState;

  // Filter State
  filterState: FilterState;

  // AI State
  aiState: AiState;

  // Meta State (App-level metadata, sync status, etc.)
  metaState: MetaState;

  // Session State
  sessionState: SessionState;

  // Potentially other top-level states if needed
  // e.g., notificationState, integrationState
}

export interface UiState {
  currentThemeId: ThemeId | 'system'; // ID of the current CustomTheme or 'system'
  customThemes: Loadable<Record<ThemeId, CustomTheme>>;
  isSidebarCollapsed: boolean;
  activeView: ViewConfig | null; // Currently active view configuration
  availableViews: Loadable<Record<ViewConfig['id'], ViewConfig>>; // All saved/predefined views
  dashboardLayout: DashboardWidget[]; // Configuration for the main dashboard
  kanbanColumns: Loadable<Record<KanbanColumnId, KanbanColumn>>; // Global or per-project Kanban columns
  listViewConfigs: Record<string, ListViewConfig>; // Keyed by view ID or a generic key
  modals: Record<string, UIElementState & { type: string; props?: GenericConfig }>; // e.g., modals['editTask'] = { isOpen: true, context: { taskId: '123' }}
  popovers: Record<string, UIElementState & { anchorEl: any; props?: GenericConfig }>;
  notifications: UINotification[];
  isCommandPaletteOpen: boolean;
  commandPaletteActions: CommandPaletteAction[];
  globalLoadingIndicator: {
    isLoading: boolean;
    message?: string;
  };
  contextMenu: UIElementState & { items: ContextMenuItem[]; position: { x: number; y: number } };
  dragAndDropState: {
    isDragging: boolean;
    itemType?: string; // e.g., 'task', 'widget'
    itemId?: string;
    source?: any;
    target?: any;
  };
  windowFocus: boolean;
  isOnline: boolean; // App's perception of network status
  fontSize: 'small' | 'medium' | 'large'; // Accessibility
  lastError?: { message: string; timestamp: Timestamp; details?: any };
  currentUser: UserId | null; // ID of the currently selected user
}

export interface FilterState {
  globalFilters: GlobalFilter[]; // Filters applied across the entire app context
  viewFilters: Record<ViewConfig['id'], ViewFilter[]>; // Filters specific to a view instance
  savedFilters: Loadable<Record<CommonSavedFilterId, SavedFilter>>; // User-saved filter presets
  quickFilterSettings: Pick<FilterSystem, 'quickFilters' | 'searchableFields' | 'smartFilters'>; // Configuration for quick filter UI
  currentSearchTerm: string;
  recentSearches: string[];
}

export interface GlobalFilter extends CommonFilter {
  // Global filters might have additional properties, e.g., if they are removable, default, etc.
  isRemovable?: boolean;
  source?: string; // Where the filter originated (e.g., 'user_global_search', 'project_default')
}

export interface ViewFilter extends CommonFilter {
  // View-specific filters might have properties like temporary, shared with view, etc.
  isTemporary?: boolean;
}

export interface SavedFilter {
  id: CommonSavedFilterId;
  name: string;
  description?: string;
  icon?: LucideIconName;
  filters: CommonFilter[]; // The actual filter criteria
  ownerId?: UserId; // If filters can be private/shared
  isShared?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  usageCount?: number; // How many times this saved filter has been used
  isFavorite?: boolean;
}


export interface AiState {
  aiSuggestions: Loadable<Record<AISuggestionId, AISuggestion>>; // Suggestions from AI
  automationRules: Loadable<Record<AutomationRuleId, AutomationRule>>;
  aiConversations: Loadable<Record<AIConversationId, AIConversation>>; // For chatbot-like interactions
  isAiAssistantEnabled: boolean; // Global toggle for AI features
  aiModelInUse?: string; // e.g., "GPT-4", "Claude-3"
  aiTokenUsage?: {
    sessionTokens: number;
    totalTokensSinceLastReset: number;
    lastResetAt?: Timestamp;
  };
  aiFeatureSettings?: Record<string, GenericConfig>; // Settings for specific AI features
}

// Using TaskAISuggestion for consistency with task.types.ts for task-specific suggestions
export type AISuggestion = TaskAISuggestion | GenericAISuggestion;

// For more generic AI suggestions not tied directly to a task property
export interface GenericAISuggestion {
  id: AISuggestionId;
  type: 'workflow_optimization' | 'project_template' | 'filter_creation' | string; // string for extensibility
  title: string;
  description: string;
  details: GenericConfig; // Could be anything depending on the suggestion type
  actions?: Array<{ label:string; actionId: string; payload?: any }>; // Suggested actions
  applied: boolean;
  timestamp: Timestamp;
  source?: string;
}
export type AISuggestionId = string; // Ensure this is defined if not in common.types


export interface AutomationRule {
  id: AutomationRuleId;
  name: string;
  description?: string;
  trigger: {
    type: 'task_created' | 'status_changed' | 'due_date_approaching' | 'tag_added' | string; // string for extensibility
    conditions?: CommonFilter[]; // Conditions for the trigger
  };
  actions: Array<{
    type: 'send_email' | 'create_subtask' | 'assign_user' | 'set_priority' | string; // string for extensibility
    params: GenericConfig; // Parameters for the action
  }>;
  isEnabled: boolean;
  executionCount?: number;
  lastExecutedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: UserId;
}

export interface AIConversation {
  id: AIConversationId;
  title?: string;
  messages: Array<{
    id: string;
    sender: 'user' | 'ai';
    content: string;
    timestamp: Timestamp;
    relatedContext?: any; // e.g., { taskId: 'abc' }
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: UserId;
  status?: 'active' | 'archived' | 'error';
}

export interface MetaState {
  appVersion: string;
  lastBackupAt?: Timestamp;
  backups: Loadable<Record<BackupId, Backup>>;
  appStatistics: Loadable<AppStatistics | null>; // Global app stats if any
  syncState: {
    isSyncing: boolean;
    lastSyncAt?: Timestamp;
    lastSyncError?: string;
    syncQueueSize?: number;
  };
  featureFlags: Record<string, boolean>; // For A/B testing or phased rollouts
  serverStatus?: 'online' | 'maintenance' | 'offline_degraded';
  databaseInfo?: {
    type: 'localforage' | 'indexeddb' | 'remote';
    size?: number; // in MB
    lastCompactedAt?: Timestamp;
  };
  // localeInfo?: { currentLocale: string; availableLocales: string[] }; // If supporting i18n
  // apiEndpoints?: Record<string, string>; // If configurable
}

export interface Backup {
  id: BackupId;
  timestamp: Timestamp;
  fileName: string;
  size: number; // in bytes
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  type: 'manual' | 'automatic';
  storageLocation?: 'local' | 'cloud'; // If applicable
  version?: string; // App version at time of backup
  notes?: string;
}

export interface AppStatistics {
  totalTasks: number;
  totalProjects: number;
  totalUsers: number; // If multi-user context
  totalTags: number;
  totalCategories: number;
  // ... any other global app-wide stats
  storageUsage?: {
    attachmentsSize: number;
    databaseSize: number;
    totalAllocated?: number;
  };
  activeAutomations?: number;
  averageTasksPerProject?: number;
  lastUpdatedAt: Timestamp;
}

export interface SessionState {
  currentUser: Loadable<User | null>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  csrfToken?: string; // If using CSRF tokens
  lastActivityAt: Timestamp;
  sessionExpiresAt?: Timestamp;
  // Could also include roles/permissions for the current user if not embedded in User object itself for quick access
  // userRoles?: string[];
  // userPermissions?: Permission[];
}

// Ensure all IDs are exported if they were defined here for the first time
export type {
  TaskId,
  SubTaskId,
  CheckListId,
  CheckListItemId,
  CheckListActionId,
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
  // AISuggestionId, // Already defined above
  AutomationRuleId,
  AIConversationId,
  BackupId,
} from './common.types';
