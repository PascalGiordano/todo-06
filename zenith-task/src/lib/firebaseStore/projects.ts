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

/**
 * Updates an existing project in Firestore.
 * @param projectId The ID of the project to update.
 * @param projectData An object containing the project fields to update.
 *                    `id` and `createdAt` should not be included. `updatedAt` is automatically set.
 */
export const updateProject = async (projectId: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    if (!projectId) {
      throw new Error("Project ID is required for updating.");
    }
    const projectDocRef = doc(db, PROJECTS_COLLECTION, projectId);
    
    // Construct the update object, ensuring serverTimestamp is correctly typed
    const updateObject: Record<string, any> = { ...projectData };
    updateObject.updatedAt = serverTimestamp() as Timestamp;

    // If startDate or endDate are passed as date strings, convert them to Timestamps
    // This assumes projectData might come from a form where dates are strings
    if (projectData.startDate && typeof projectData.startDate === 'string') {
        updateObject.startDate = Timestamp.fromDate(new Date(projectData.startDate));
    }
    if (projectData.endDate && typeof projectData.endDate === 'string') {
        updateObject.endDate = Timestamp.fromDate(new Date(projectData.endDate));
    }
    // Note: If startDate/endDate in projectData are already Firestore Timestamps (e.g. from a fetched project object),
    // they will be fine as is. The above conversion is for string inputs from forms.

    await updateDoc(projectDocRef, updateObject);
  } catch (error) {
    console.error("Error updating project: ", error);
    // Consider more specific error types or logging frameworks in a real app
    throw new Error(`Failed to update project ${projectId}. See console for details.`);
  }
};

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
