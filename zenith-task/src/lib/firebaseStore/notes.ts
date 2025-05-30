import { db } from '../firebaseConfig'; // Assumes db is exported from firebaseConfig.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import type { Note, NewNoteData, UpdateNoteData } from '@/types/note'; // Adjust path if types are elsewhere

const NOTES_COLLECTION = 'notes';

/**
 * Adds a new note to Firestore.
 * @param noteData Data for the new note. `userId` must be provided.
 * @returns The ID of the newly created note.
 */
export const addNote = async (noteData: NewNoteData): Promise<string> => {
  if (!noteData.userId) {
    // In a real app, userId would come from the authenticated user context.
    // For now, this check emphasizes its importance.
    console.error("UserID is required to create a note.");
    throw new Error('UserID is required.'); 
  }
  try {
    const noteWithTimestamps = {
      ...noteData,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), noteWithTimestamps);
    return docRef.id;
  } catch (error) {
    console.error("Error adding note: ", error);
    throw new Error('Failed to add note. See console for details.');
  }
};

/**
 * Fetches all notes for a given user, ordered by updatedAt descending.
 * @param userId The ID of the user whose notes to fetch.
 * @returns A promise that resolves to an array of Note objects.
 */
export const getNotesByUserId = async (userId: string): Promise<Note[]> => {
  if (!userId) {
    console.error("UserID is required to fetch notes.");
    return []; // Or throw an error
  }
  try {
    const notesCollectionRef = collection(db, NOTES_COLLECTION);
    const q = query(
      notesCollectionRef, 
      where('userId', '==', userId), 
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notes: Note[] = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() } as Note);
    });
    return notes;
  } catch (error) {
    console.error("Error fetching notes by user ID: ", error);
    throw new Error('Failed to fetch notes. See console for details.');
  }
};

/**
 * Fetches a single note by its ID.
 * @param noteId The ID of the note to fetch.
 * @returns A promise that resolves to the Note object or null if not found.
 */
export const getNoteById = async (noteId: string): Promise<Note | null> => {
  try {
    const noteDocRef = doc(db, NOTES_COLLECTION, noteId);
    const docSnap = await getDoc(noteDocRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Note;
    } else {
      console.log("No such note found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching note by ID: ", error);
    throw new Error('Failed to fetch note by ID. See console for details.');
  }
};

/**
 * Updates an existing note in Firestore. `userId` and `createdAt` cannot be changed.
 * @param noteId The ID of the note to update.
 * @param noteData An object containing the note fields to update.
 */
export const updateNote = async (noteId: string, noteData: UpdateNoteData): Promise<void> => {
  try {
    if (!noteId) {
      throw new Error("Note ID is required for updating.");
    }
    const noteDocRef = doc(db, NOTES_COLLECTION, noteId);
    
    // Ensure forbidden fields are not in noteData - though type system should help
    const { userId, createdAt, ...validUpdateData } = noteData as any; 

    const updateObject = {
      ...validUpdateData,
      updatedAt: serverTimestamp() as Timestamp,
    };

    await updateDoc(noteDocRef, updateObject);
  } catch (error) {
    console.error("Error updating note: ", error);
    throw new Error(`Failed to update note ${noteId}. See console for details.`);
  }
};

/**
 * Deletes a note from Firestore.
 * @param noteId The ID of the note to delete.
 */
export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    if (!noteId) {
      throw new Error("Note ID is required for deletion.");
    }
    const noteDocRef = doc(db, NOTES_COLLECTION, noteId);
    await deleteDoc(noteDocRef);
  } catch (error) {
    console.error("Error deleting note: ", error);
    throw new Error(`Failed to delete note ${noteId}. See console for details.`);
  }
};
