"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { getNoteById, addNote, updateNote, deleteNote } from '@/lib/firebaseStore/notes';
import type { Note, NewNoteData, UpdateNoteData } from '@/types/note';
import { Timestamp } from 'firebase/firestore';
import { SaveIcon, XCircleIcon, Trash2Icon, ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // For optional Markdown preview

// Hardcoded user ID for now. Replace with actual authenticated user ID later.
const CURRENT_USER_ID = "test-user-id";

const NoteEditorPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const noteIdParam = params.noteId as string;

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [originalNote, setOriginalNote] = useState<Note | null>(null); // To compare for changes

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false); // For initial data load
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const isNewNote = noteIdParam === 'new';

  // Fetch note data if editing an existing note
  useEffect(() => {
    if (!isNewNote && noteIdParam) {
      const fetchNote = async () => {
        setIsFetching(true);
        setError(null);
        try {
          const fetchedNote = await getNoteById(noteIdParam);
          if (fetchedNote) {
            // Security check: In a real app, ensure fetchedNote.userId === CURRENT_USER_ID
            // Firestore rules should handle this, but client-side check is good defense-in-depth.
            if (fetchedNote.userId !== CURRENT_USER_ID) {
                setError("You don't have permission to edit this note.");
                setOriginalNote(null);
                setNoteTitle('');
                setNoteContent('');
                return;
            }
            setNoteTitle(fetchedNote.title);
            setNoteContent(fetchedNote.content);
            setOriginalNote(fetchedNote);
          } else {
            setError('Note not found.');
          }
        } catch (err) {
          console.error("Error fetching note:", err);
          setError(err instanceof Error ? err.message : 'Failed to fetch note data.');
        } finally {
          setIsFetching(false);
        }
      };
      fetchNote();
    } else if (isNewNote) {
      // Reset fields for new note form
      setNoteTitle('');
      setNoteContent('');
      setOriginalNote(null);
      setIsFetching(false);
    }
  }, [noteIdParam, isNewNote]);

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      setError("Title is required.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isNewNote) {
        const newNoteData: NewNoteData = {
          title: noteTitle.trim(),
          content: noteContent,
          userId: CURRENT_USER_ID,
          // Optional fields - can be added via UI later
          projectId: null, 
          tags: [],
          parentId: null,
        };
        await addNote(newNoteData);
        setSuccessMessage("Note created successfully!");
      } else if (originalNote) { // Ensure originalNote is loaded before allowing update
        const updateData: UpdateNoteData = {
          title: noteTitle.trim(),
          content: noteContent,
          // Potentially update tags, projectId if UI exists for them
        };
        await updateNote(originalNote.id, updateData);
        setSuccessMessage("Note updated successfully!");
      }
      setTimeout(() => router.push('/notes'), 1000); // Navigate back after showing success
    } catch (err) {
      console.error("Error saving note:", err);
      setError(err instanceof Error ? err.message : 'Failed to save note.');
      setIsLoading(false); // Keep form enabled on error
    } 
    // setIsLoading(false) is handled by finally in fetch or not needed if navigating away
  };

  const handleDeleteNote = async () => {
    if (isNewNote || !originalNote) return;

    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteNote(originalNote.id);
        alert("Note deleted successfully."); // Simple alert for now
        router.push('/notes');
      } catch (err) {
        console.error("Error deleting note:", err);
        setError(err instanceof Error ? err.message : 'Failed to delete note.');
        setIsLoading(false);
      }
    }
  };
  
  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2Icon className="animate-spin h-8 w-8 text-primary mr-3" />
          <p className="text-lg text-muted-foreground">Loading note editor...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
           <button
            onClick={() => router.push('/notes')}
            className="flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors mb-4"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Notes
          </button>
          <h1 className="text-3xl font-semibold text-foreground">
            {isNewNote ? 'Create New Note' : `Edit Note: ${originalNote?.title || noteTitle || '...'}`}
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="note-title" className="block text-sm font-medium text-muted-foreground mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="note-title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Enter your note title"
              className="w-full bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 placeholder-gray-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="note-content" className="block text-sm font-medium text-muted-foreground mb-1">
              Content (Markdown supported)
            </label>
            <textarea
              id="note-content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={12}
              placeholder="Start writing your note here..."
              className="w-full bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 placeholder-gray-500 font-mono text-sm"
              disabled={isLoading}
            />
          </div>
          
          {/* Optional Markdown Preview */}
          {noteContent && (
            <div className="mt-4 p-1">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2 border-b border-gray-700 pb-2">Preview</h3>
              <div className="prose prose-sm prose-invert max-w-none bg-gray-800/30 p-4 rounded-md border border-gray-700 min-h-[50px]">
                <ReactMarkdown>{noteContent}</ReactMarkdown>
              </div>
            </div>
          )}

          {error && (
            <div className="my-4 text-sm text-red-400 bg-red-900/30 border border-red-700/50 p-3 rounded-lg flex items-center">
              <AlertTriangleIcon size={20} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
             <div className="my-4 text-sm text-green-400 bg-green-900/30 border border-green-700/50 p-3 rounded-lg flex items-center">
              <CheckCircleIcon size={20} className="mr-2 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-700 space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              {!isNewNote && originalNote && (
                <button
                  type="button"
                  onClick={handleDeleteNote}
                  disabled={isLoading}
                  className="px-5 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-800/30 rounded-lg transition-colors duration-150 disabled:opacity-50 flex items-center"
                >
                  <Trash2Icon size={16} className="mr-2" />
                  Delete Note
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => router.push('/notes')}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-150 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={isLoading || !!successMessage}
                className="px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-150 disabled:opacity-60 flex items-center"
              >
                {isLoading && !successMessage ? (
                  <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <SaveIcon size={16} className="mr-2" />
                )}
                {isLoading && !successMessage ? 'Saving...' : (successMessage ? 'Saved!' : (isNewNote ? 'Create Note' : 'Save Changes'))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NoteEditorPage;
