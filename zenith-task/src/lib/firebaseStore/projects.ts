import { db } from '../firebaseConfig'; // Assuming db is exported from firebaseConfig.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import type { Project, NewProjectData, UpdateProjectData } from '@/types/project'; // Adjust path if types are elsewhere

const PROJECTS_COLLECTION = 'projects';

/**
 * Adds a new project to Firestore.
 * @param projectData Data for the new project, excluding id, createdAt, and updatedAt.
 * @returns The ID of the newly created project.
 */
export const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const projectWithTimestamps = {
      ...projectData,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectWithTimestamps);
    return docRef.id;
  } catch (error) {
    console.error("Error adding project: ", error);
    // Consider more specific error handling or re-throwing
    throw new Error('Failed to add project. See console for details.');
  }
};

/**
 * Fetches all projects from Firestore, ordered by creation date (newest first).
 * @returns A promise that resolves to an array of Project objects.
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsCollectionRef = collection(db, PROJECTS_COLLECTION);
    // Example: Order by createdAt descending. Add more complex queries as needed.
    const q = query(projectsCollectionRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        startDate: data.startDate, // Firestore Timestamps are converted automatically by SDK
        endDate: data.endDate,
        status: data.status,
        categories: data.categories,
        tags: data.tags,
        userIds: data.userIds,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Project); // Type assertion, ensure data matches Project structure
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw new Error('Failed to fetch projects. See console for details.');
  }
};

/**
 * Fetches a single project by its ID from Firestore.
 * @param projectId The ID of the project to fetch.
 * @returns A promise that resolves to the Project object or null if not found.
 */
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    const projectDocRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(projectDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        categories: data.categories,
        tags: data.tags,
        userIds: data.userIds,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Project; // Type assertion
    } else {
      console.log("No such project found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching project by ID: ", error);
    throw new Error('Failed to fetch project by ID. See console for details.');
  }
};

// Optional: UpdateProject function
// export const updateProject = async (projectId: string, updates: UpdateProjectData): Promise<void> => {
//   try {
//     const projectDocRef = doc(db, PROJECTS_COLLECTION, projectId);
//     await updateDoc(projectDocRef, {
//       ...updates,
//       updatedAt: serverTimestamp() as Timestamp,
//     });
//   } catch (error) {
//     console.error("Error updating project: ", error);
//     throw new Error('Failed to update project. See console for details.');
//   }
// };

// Optional: DeleteProject function
// export const deleteProject = async (projectId: string): Promise<void> => {
//   try {
//     const projectDocRef = doc(db, PROJECTS_COLLECTION, projectId);
//     await deleteDoc(projectDocRef);
//   } catch (error) {
//     console.error("Error deleting project: ", error);
//     throw new Error('Failed to delete project. See console for details.');
//   }
// };
