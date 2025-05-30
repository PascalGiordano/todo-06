"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, FileTextIcon, AlertTriangleIcon } from 'lucide-react'; // Added FileTextIcon, AlertTriangleIcon
import DashboardLayout from '@/components/layout/dashboard-layout';
import { getNotesByUserId } from '@/lib/firebaseStore/notes'; // Adjust path as necessary
import type { Note } from '@/types/note'; // Adjust path as necessary
import { format } from 'date-fns'; 
import { Timestamp } from 'firebase/firestore';

// Hardcoded user ID for now. Replace with actual authenticated user ID later.
const CURRENT_USER_ID = "test-user-id"; 

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedNotes = await getNotesByUserId(CURRENT_USER_ID);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []); // CURRENT_USER_ID is constant, so no dependency needed for it if it were from context/props

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const formatDate = (timestamp: Timestamp | Date | string | undefined): string => {
    if (!timestamp) return 'N/A';
    let date: Date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      try {
        date = new Date(timestamp);
      } catch {
        return String(timestamp); // Fallback for unparsable strings
      }
    }
    return format(date, 'MMM d, yyyy HH:mm'); // e.g., "Oct 27, 2023 14:30"
  };

  const truncateContent = (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-foreground">My Notes</h1>
        <Link href="/notes/new" passHref>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
            <PlusCircle size={20} className="mr-2" />
            Create New Note
          </button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg text-muted-foreground ml-4">Loading notes...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-6 rounded-lg flex items-center">
          <AlertTriangleIcon size={24} className="mr-3 text-red-400 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-lg mb-1">Error Fetching Notes</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && notes.length === 0 && (
        <div className="text-center py-12">
          <FileTextIcon className="mx-auto h-16 w-16 text-gray-500" strokeWidth={1.5} />
          <h3 className="mt-3 text-xl font-semibold text-foreground">No notes yet</h3>
          <p className="mt-1 text-md text-muted-foreground">
            Get started by creating your first note.
          </p>
          <div className="mt-8">
            <Link href="/notes/new" passHref>
               <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-lg flex items-center transition-colors duration-200 mx-auto text-sm">
                <PlusCircle size={18} className="mr-2" />
                Create New Note
              </button>
            </Link>
          </div>
        </div>
      )}

      {!isLoading && !error && notes.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`} passHref>
              <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700 shadow-sm hover:border-primary/70 hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full cursor-pointer group">
                <div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 truncate" title={note.title}>
                    {note.title}
                  </h2>
                  <p className="text-sm text-muted-foreground/80 mb-3 h-16 overflow-hidden relative">
                    {truncateContent(note.content, 80)}
                    <span className="absolute bottom-0 right-0 h-6 w-full bg-gradient-to-t from-gray-800/50 to-transparent"></span>
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700/60">
                  <p className="text-xs text-muted-foreground/70">
                    Last updated: {formatDate(note.updatedAt)}
                  </p>
                  {note.projectId && (
                    <p className="text-xs text-sky-400/70 mt-1">
                      Project: {/* TODO: Fetch project title */} {note.projectId.substring(0,10)}...
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NotesPage;
