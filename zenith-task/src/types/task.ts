import { Timestamp } from 'firebase/firestore';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

// Consider if TaskStatus should be distinct from Kanban column titles,
// or if column titles directly represent task statuses.
// For now, assuming status maps to column ID/title.
// export type TaskStatus = 'To Do' | 'In Progress' | 'Blocked' | 'In Review' | 'Done';

export interface Task {
  id: string; // Unique identifier for the task
  title: string; // Main title of the task
  description?: string; // Optional, for more details, Markdown supported
  priority: TaskPriority;
  status: string; // Represents the column ID or status name (e.g., 'To Do', 'column-1')
  projectId: string; // ID of the project this task belongs to
  assigneeIds: string[]; // Array of user IDs assigned to the task
  dueDate?: Timestamp | null; // Optional due date, store as Firestore Timestamp for consistency
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tags?: string[]; // Optional array of tag strings
  order?: number; // Optional, for ordering within a column if not relying on array index
}

// For creating a new task, some fields are set by the system or optional
export type NewTaskData = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'> & {
  // order might be set based on the current number of tasks in a column
  // createdAt and updatedAt will be server timestamps
};

// For updating a task
export type UpdateTaskData = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
