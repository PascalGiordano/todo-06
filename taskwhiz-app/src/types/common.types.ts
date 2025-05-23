// Type Aliases for IDs
export type PriorityId = string;
export type StatusId = string;
export type CategoryId = string;
export type ProjectId = string;
export type TagId = string;
export type UserId = string;
export type TaskId = string;
export type SubTaskId = string;
export type CheckListId = string;
export type CheckListItemId = string;
export type CheckListActionId = string;
export type AttachmentId = string;
export type CollectionId = string; // Generic ID for collections if needed
export type WidgetId = string;
export type FilterId = string;
export type PermissionId = string;
export type ThemeId = string;
export type DashboardWidgetId = string;
export type KanbanColumnId = string;
export type ViewId = string; // For different views like Kanban, List, Calendar
export type SavedFilterId = string;
export type AISuggestionId = string;
export type AutomationRuleId = string;
export type AIConversationId = string;
export type BackupId = string;

// LucideIconName
export type LucideIconName = string;

// General purpose types
export type Timestamp = number; // Unix timestamp
export type DateString = string; // ISO 8601 date string

// For fields that might be complex objects but are not detailed yet
export type EmptyObject = Record<string, never>; // For statistics, etc.
export type GenericConfig = Record<string, any>; // For widget configs, etc.

// For permissions, if they become more complex
export type Permission = string; // e.g., "task:create", "project:edit"

// For filters
export type Filter = {
  id: FilterId;
  field: string;
  operator: string; // e.g., 'equals', 'contains', 'greaterThan'
  value: any;
};
