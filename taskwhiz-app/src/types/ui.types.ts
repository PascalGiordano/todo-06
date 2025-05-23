import type {
  TaskId,
  WidgetId,
  FilterId,
  PermissionId,
  ThemeId,
  UserId,
  KanbanColumnId,
  StatusId,
  LucideIconName,
  Timestamp,
  DateString,
  GenericConfig,
  Filter,
  Permission,
  SavedFilterId,
  PriorityId,
  TagId,
} from './common.types';
import type { Task } from './task.types'; // For TaskCardProps

// Component Prop Interfaces
export interface TaskCardProps {
  task: Task;
  onClick?: (id: TaskId) => void;
  showAssignees?: boolean;
  showTags?: boolean;
  showDueDate?: boolean;
  showPriority?: boolean;
  isSelected?: boolean;
  customActions?: TaskCardAction[];
}

export interface TaskCardAction {
  label: string;
  icon?: LucideIconName;
  onClick: (taskId: TaskId) => void;
  color?: string; // Optional color for the action button/text
}

// Widget System
export type WidgetType =
  | 'summary'
  | 'task_list'
  | 'calendar'
  | 'gantt_chart'
  | 'burndown_chart'
  | 'activity_feed'
  | 'project_status'
  | 'user_assignments'
  | 'custom_chart'
  | 'notes'
  | 'pomodoro_timer';

export interface Widget {
  id: WidgetId;
  type: WidgetType;
  title: string;
  config: GenericConfig; // Type will vary based on WidgetType, e.g., ChartConfig, TaskListConfig
  filters?: Filter[]; // Filters applied to this widget's data
  permissions?: Permission[]; // Who can view/edit this widget
  data?: any; // Loaded data for the widget
  isLoading?: boolean;
  lastRefreshedAt?: Timestamp;
  refreshInterval?: number; // in seconds
  gridPosition?: { x: number; y: number; w: number; h: number }; // For dashboard layout
}

// Filter System
export interface SearchableField {
  fieldId: string; // e.g., "title", "description", "customField.abc"
  label: string;
  type: 'text' | 'date' | 'select' | 'number' | 'boolean';
  options?: Array<{ value: any; label: string }>; // For select type
}

export interface QuickFilter {
  id: FilterId;
  label: string;
  icon?: LucideIconName;
  filterLogic: Filter[]; // Array of Filter objects to apply
  isDefault?: boolean;
}

export interface AdvancedFilter extends Filter {
  // Inherits id, field, operator, value from Filter
  // May add more specific properties for advanced scenarios if needed
  // For example, grouping conditions (AND/OR) if filters become complex expressions
}

export interface SmartFilter {
  id: FilterId;
  name: string;
  description?: string;
  criteria: string; // Could be a human-readable string or a specific DSL for smart filtering
  // e.g., "due_this_week", "assigned_to_me_and_high_priority"
  icon?: LucideIconName;
}

export interface FilterSystem {
  quickFilters: QuickFilter[];
  advancedFilters: AdvancedFilter[];
  smartFilters: SmartFilter[];
  savedFilters: SavedFilterId[]; // IDs of SavedFilter objects (defined in state.types.ts)
  searchableFields: SearchableField[];
  globalSearchTerm?: string;
}

// UI Configuration Types
export interface CustomTheme {
  id: ThemeId;
  name: string;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string; // For cards, modals, etc.
    textPrimary: string;
    textSecondary: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    // Specific component colors
    buttonPrimaryBackground?: string;
    buttonPrimaryText?: string;
    sidebarBackground?: string;
    headerBackground?: string;
    // ... and so on
  };
  typography?: {
    fontFamily?: string;
    fontSizeBase?: string; // e.g., '16px'
    // ... other typography settings
  };
  spacing?: {
    baseUnit?: string; // e.g., '4px'
    // ... other spacing settings
  };
  borderRadius?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  shadows?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isSystemTheme?: boolean; // True if this is a predefined system theme
}

export type ViewType = 'list' | 'kanban' | 'calendar' | 'gantt' | 'matrix' | 'mindmap';

export interface DashboardWidget {
  id: string; // Unique ID for this instance of a widget on a dashboard
  widgetType: WidgetType; // The type of widget (e.g., 'task_list', 'summary')
  title?: string; // User-defined title for this widget instance
  gridConfig: {
    x: number; // Grid column start
    y: number; // Grid row start
    w: number; // Width in grid units
    h: number; // Height in grid units
    static?: boolean; // If true, widget cannot be moved or resized
  };
  settings?: GenericConfig; // Widget-specific settings, e.g., { projectId: 'abc', maxItems: 10 }
  filters?: Filter[]; // Filters specific to this widget instance
  lastUpdatedAt: Timestamp;
}

export interface KanbanColumn {
  id: KanbanColumnId;
  title: string;
  statusMappings: StatusId[]; // Statuses that belong to this column
  order: number;
  taskLimit?: number; // WIP limit
  color?: string; // Column header color
  icon?: LucideIconName;
  tasks: TaskId[]; // Ordered list of task IDs in this column
  isCollapsed?: boolean;
  isDefault?: boolean; // e.g., the "Backlog" column
  isDoneColumn?: boolean; // Column for completed tasks
}

export interface ListViewConfig {
  visibleFields: string[]; // IDs or names of fields to show as columns
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  groupBy?: string; // Field ID to group tasks by
  showSubtasksInline?: boolean;
  showCompletedTasks?: boolean;
  compactMode?: boolean;
}

// Could be a type for a generic "View" configuration object
export interface ViewConfig {
  id: string; // View ID
  name: string;
  type: ViewType;
  icon?: LucideIconName;
  isFavorite?: boolean;
  isShared?: boolean;
  ownerId?: UserId;
  filters?: Filter[]; // Filters applied to this view
  // Specific config based on type
  listView?: ListViewConfig;
  kanbanView?: {
    columnIds: KanbanColumnId[]; // Ordered list of columns
    groupBy?: string; // If Kanban is grouped by something other than status (e.g., assignee)
  };
  calendarView?: {
    defaultMode: 'day' | 'week' | 'month';
    showWeekends?: boolean;
  };
  ganttView?: {
    timeScale: 'day' | 'week' | 'month';
    showDependencies?: boolean;
  };
  // ... other view types
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Breadcrumb item for navigation
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIconName;
}

// General UI element state, e.g., for modals or popovers
export interface UIElementState {
  isOpen: boolean;
  context?: any; // Any data the UI element might need when opened
}

// For notifications displayed in the UI
export interfaceUINotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number; // Auto-dismiss duration in ms
  isDismissible?: boolean;
  icon?: LucideIconName;
  actions?: Array<{ label: string; onClick: () => void }>;
  createdAt: Timestamp;
}

// Context menu item structure
export interface ContextMenuItem {
  label: string;
  icon?: LucideIconName;
  action: () => void;
  disabled?: boolean;
  isSeparator?: boolean;
  subMenu?: ContextMenuItem[];
  shortcut?: string; // e.g., "Ctrl+S"
}

// Command Palette action structure
export interface CommandPaletteAction {
  id: string;
  title: string;
  category: string; // e.g., "Navigation", "Tasks", "Settings"
  icon?: LucideIconName;
  action: () => void; // Function to execute
  keywords?: string[]; // For searching
  shortcut?: string;
  // Future: Add support for dynamic actions, parameters, etc.
}

// Used for UI elements that can be in a loading state
export interface Loadable<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Timestamp;
}

// For representing selectable items in dropdowns, lists etc.
export interface SelectableItem<T = string> {
  value: T;
  label: string;
  icon?: LucideIconName;
  color?: string;
  disabled?: boolean;
  group?: string; // Optional group name for optgroups
}
