import type {
  UserId,
  ThemeId,
  Timestamp,
  DateString,
  LucideIconName,
  EmptyObject,
  GenericConfig,
  Permission,
  FilterId,
  ViewId,
  SavedFilterId,
} from './common.types';

export interface User {
  id: UserId;
  username: string; // Should be unique, perhaps same as email or a chosen nickname
  email: string; // Should be unique and used for login
  firstName?: string;
  lastName?: string;
  fullName?: string; // Auto-generated from firstName and lastName if not provided
  initials?: string; // Auto-generated
  color?: string; // UI color associated with the user, auto-generated
  avatarUrl?: string; // URL to user's avatar image
  role?: string; // e.g., 'admin', 'member'
  timezone?: string; // e.g., "America/New_York"
  language?: string; // e.g., "en-US"
  dateFormat?: string; // e.g., "MM/DD/YYYY"
  timeFormat?: string; // e.g., "12h" or "24h"
  startOfWeek?: 'saturday' | 'sunday' | 'monday';
  isActive?: boolean;
  isOnline?: boolean;
  lastLoginAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // roles: string[]; // Replaced by a single 'role' string for simplicity now
  permissions?: Permission[]; // Specific permissions overriding role
  preferencesId: UserPreferencesId; // ID linking to UserPreferences document/object
  statisticsId?: UserStatisticsId; // ID linking to UserStatistics document/object
  twoFactorEnabled?: boolean;
  emailVerified?: boolean;
  lastPasswordChangeAt?: Timestamp;
  notificationSettings?: NotificationSettings; // Detailed notification preferences
  integrations?: Record<string, UserIntegrationSetting>; // e.g., Slack, Google Calendar
  customFields?: Record<string, any>; // User-specific custom data
  assignedTasksCount?: number; // Denormalized count for quick display
  completedTasksCount?: number; // Denormalized count
}

export type UserPreferencesId = string;
export type UserStatisticsId = string;

export interface UserPreferences {
  id: UserPreferencesId;
  userId: UserId;
  theme: 'light' | 'dark' | 'system' | string; // string for custom themeId
  darkMode: 'light' | 'dark' | 'system'; // Keep this for explicit dark mode toggle
  language: string; // e.g., 'en', 'fr'
  timezone: string; // e.g., 'Europe/Paris'
  defaultView: ViewId; // Default view for tasks (e.g., list, kanban)
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  customShortcuts?: Record<string, string>; // e.g., { "newTask": "Ctrl+N" }
  taskDensity?: 'compact' | 'comfortable';
  sidebarBehavior?: 'pinned' | 'collapsible' | 'hidden';
  dashboardWidgets?: DashboardWidgetUserConfig[]; // User's specific dashboard layout
  keyboardShortcutsEnabled?: boolean;
  aiAssistantEnabled?: boolean;
  dataSyncFrequency?: 'manual' | 'hourly' | 'daily'; // For cloud sync
  privacySettings?: {
    showActivityStatus: boolean;
    allowDataCollectionForAI: boolean;
  };
  accessibility?: {
    fontSize?: 'small' | 'medium' | 'large';
    highContrastMode?: boolean;
  };
  updatedAt: Timestamp;
}

export interface DashboardWidgetUserConfig {
  widgetId: string; // ID of the widget
  order: number;
  settings?: GenericConfig; // User-specific overrides for this widget instance
  isVisible?: boolean;
}

// Placeholder for now, can be expanded later
export interface UserStatistics {
  id: UserStatisticsId;
  userId: UserId;
  tasksCreated?: number;
  tasksCompleted?: number;
  tasksInProgress?: number;
  projectsContributedTo?: number;
  commentsMade?: number;
  checklistsCompleted?: number;
  timeTrackedSeconds?: number; // Total time tracked in seconds
  // For simplicity, streak and achievements can be complex objects or empty for now
  streak?: EmptyObject | {
    current: number; // Current daily streak of using the app or completing tasks
    longest: number;
    lastContributionDate?: DateString;
  };
  achievements?: string[]; // IDs or names of earned achievements/badges
  updatedAt: Timestamp;
  // Could include more detailed stats like:
  // averageTaskCompletionTime?: number;
  // busiestDayOfWeek?: number; // 0-6
  // mostProductiveHour?: number; // 0-23
}

export interface NotificationSettings {
  taskAssignment: boolean;
  taskDueDateReminder: boolean; // Global toggle, specific reminders in ReminderConfig
  commentMention: boolean;
  projectUpdates: boolean;
  newFeatureAnnouncements: boolean;
  securityAlerts: boolean;
  backupCompletion: boolean;
  aiSuggestionNotifications: boolean;
}

export interface UserIntegrationSetting {
  connected: boolean;
  userIdInIntegration?: string; // User's ID in the external service
  settings?: GenericConfig; // Specific settings for this integration, e.g., default channel for Slack
  lastSyncAt?: Timestamp;
}
