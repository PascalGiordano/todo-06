import type {
  PriorityId,
  StatusId,
  CategoryId,
  ProjectId,
  TagId,
  UserId,
  TaskId,
  SubTaskId,
  CheckListId,
  CheckListItemId,
  CheckListActionId,
  AttachmentId,
  Timestamp,
  DateString,
  LucideIconName,
  EmptyObject,
} from './common.types';

export interface Task {
  id: TaskId;
  title: string;
  description?: string;
  priorityId: PriorityId;
  statusId: StatusId;
  categoryId?: CategoryId;
  projectId?: ProjectId;
  tags: TagId[];
  assignees: UserId[];
  dependencies: TaskId[]; // IDs of tasks that this task depends on
  subTasks: SubTaskId[];
  checkLists: CheckListId[];
  attachments: AttachmentId[];
  dueDate?: DateString;
  estimatedTime?: number; // in hours or minutes
  actualTimeSpent?: number; // in hours or minutes
  storyPoints?: number;
  recurringConfig?: RecurringConfig;
  reminderConfig?: ReminderConfig;
  location?: string; // For tasks that are location-specific
  progress?: number; // 0-100
  customFields?: Record<string, any>;
  commentsCount?: number;
  lastActivityAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: UserId;
  updatedBy?: UserId;
  completedAt?: Timestamp;
  archivedAt?: Timestamp;
  isBillable?: boolean;
  gantt?: GanttDetails; // For Gantt chart specific details
  kanbanOrder?: number; // Order within a Kanban column
  viewSpecificInfo?: Record<string, any>; // For specific view needs, e.g., position in a list
  aiGeneratedContent?: AISuggestion[]; // AI suggestions related to this task
}

export interface SubTask {
  id: SubTaskId;
  parentId: TaskId;
  title: string;
  completed: boolean;
  assignees?: UserId[];
  dueDate?: DateString;
  estimatedTime?: number;
  actualTimeSpent?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: UserId;
}

export interface CheckList {
  id: CheckListId;
  taskId: TaskId;
  title: string;
  items: CheckListItemId[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: UserId;
}

export interface CheckListItem {
  id: CheckListItemId;
  checkListId: CheckListId;
  text: string;
  completed: boolean;
  completedBy?: UserId;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CheckListAction {
  id: CheckListActionId;
  checkListItemId: CheckListItemId;
  userId: UserId; // User who performed the action
  actionType: 'checked' | 'unchecked' | 'created' | 'deleted' | 'edited';
  timestamp: Timestamp;
  previousValue?: string; // For 'edited' action
  currentValue?: string; // For 'edited' action
}

export interface Attachment {
  id: AttachmentId;
  taskId: TaskId;
  userId: UserId; // User who uploaded
  fileName: string;
  fileType: string; // MIME type
  fileSize: number; // in bytes
  url: string; // URL to access the file
  previewUrl?: string; // Optional preview image URL
  createdAt: Timestamp;
  description?: string;
}

export interface RecurringConfig {
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  daysOfWeek?: number[]; // 0 (Sun) - 6 (Sat), for weekly
  dayOfMonth?: number; // 1-31, for monthly
  monthOfYear?: number; // 1-12, for yearly
  customIntervalDays?: number; // For custom interval
  startDate: DateString;
  endDate?: DateString;
  nextDueDate?: DateString; // Calculated next due date
}

export interface ReminderConfig {
  remindAt: Timestamp;
  type: 'email' | 'push_notification' | 'sms'; // Notification type
  isSent?: boolean;
}

export interface GanttDetails {
  startDate: DateString;
  endDate: DateString;
  progress: number; // 0-100, can be different from main task progress if Gantt is managed separately
  milestone?: boolean;
}

export interface AISuggestion {
  id: string; // Or use a more specific AISuggestionId if defined in common.types.ts
  type: 'description_improvement' | 'subtask_creation' | 'tag_suggestion' | 'priority_recommendation';
  content: string; // The suggested text or value
  applied: boolean;
  timestamp: Timestamp;
  source?: string; // e.g., "OpenAI GPT-4"
}
