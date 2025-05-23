import type {
  PriorityId,
  StatusId,
  CategoryId,
  ProjectId,
  TagId,
  UserId,
  LucideIconName,
  Timestamp,
  DateString,
} from './common.types';

export interface Priority {
  id: PriorityId;
  name: string;
  color: string; // Hex color code or Tailwind color name
  icon?: LucideIconName;
  order: number; // For sorting priorities
  isDefault?: boolean;
  description?: string;
  isActive: boolean; // Added isActive
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Status {
  id: StatusId;
  name: string;
  color: string; // Hex color code or Tailwind color name
  icon: LucideIconName; // Made non-optional as per form requirements
  order: number; // For sorting statuses
  type: 'todo' | 'progress' | 'review' | 'done' | 'cancelled'; // Added type
  description?: string;
  isActive: boolean; // Added isActive
  allowedTransitions?: StatusId[]; // Added allowedTransitions (replacing nextStatusIds for clarity)
  isDefault?: boolean; // Optional: if some statuses are system defaults and non-deletable
  isCompletedStatus?: boolean; // True if tasks with this status are considered "done"
  isArchivedStatus?: boolean; // True if tasks with this status are considered archived
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: CategoryId;
  name: string;
  color: string; // Made non-optional as per form requirements
  icon: LucideIconName; // Made non-optional as per form requirements
  order: number; // Added order
  description?: string;
  parentCategoryId?: CategoryId; // For sub-categories
  isActive: boolean; // Added isActive
  defaultPriorityId?: PriorityId; // Default priority for tasks in this category
  defaultProjectId?: ProjectId; // Default project for tasks in this category
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: UserId; // Kept for good practice
}

export interface Project {
  id: ProjectId;
  name: string;
  description?: string;
  color?: string; // Project color
  icon?: LucideIconName;
  ownerId: UserId;
  members: UserId[]; // Users who are part of this project
  defaultCategoryId?: CategoryId;
  defaultPriorityId?: PriorityId;
  defaultStatusId?: StatusId;
  startDate?: DateString;
  endDate?: DateString;
  isArchived?: boolean;
  isPrivate?: boolean; // If false, visible to all users in the workspace (if workspace concept exists)
  customFieldsSchema?: Record<string, { type: string, label: string, options?: any[] }>; // Schema for project-specific custom fields
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archivedAt?: Timestamp;
}

export interface Tag {
  id: TagId;
  name: string;
  color?: string; // Tag color
  icon?: LucideIconName;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: UserId;
}
