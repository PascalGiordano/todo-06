import { Timestamp } from 'firebase/firestore'; // Using Firestore Timestamp

export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed" | "Archived";

export interface Category {
  id: string; // Could be a slug or generated ID
  name: string;
  color: string; // e.g., Tailwind CSS color class or hex
  icon?: string; // Optional: Lucide icon name or SVG string
}

export interface Tag {
  id: string; // Could be a slug or generated ID
  name: string;
  color: string; // e.g., Tailwind CSS color class or hex
}

export interface Project {
  id: string; // Document ID from Firestore
  title: string;
  description: string; // Markdown supported
  startDate: Timestamp; // Store as Firestore Timestamp for consistency and query capabilities
  endDate: Timestamp;   // Store as Firestore Timestamp
  status: ProjectStatus;
  categories: Category[]; // Array of Category objects
  tags: Tag[];          // Array of Tag objects
  userIds: string[];    // IDs of users associated with the project
  // roles?: { [userId: string]: string }; // Example: { "user123": "Project Lead" } - Keep optional for now
  createdAt: Timestamp; // Firestore server timestamp
  updatedAt: Timestamp; // Firestore server timestamp
}

// For creating a new project, some fields are omitted or optional initially
export type NewProjectData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

// For updating a project, all fields are optional, and ID is required
export type UpdateProjectData = Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>;
