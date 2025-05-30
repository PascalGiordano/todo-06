"use client";

import React, { useState, Fragment, FormEvent, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, CheckCircleIcon, ExclamationCircleIcon, ChevronDownIcon } from 'lucide-react';
import { addProject } from '@/lib/firebaseStore/projects';
import { ProjectStatus, Category, Tag, NewProjectData } from '@/types/project'; // Ensure correct path
import { Timestamp } from 'firebase/firestore';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

const PROJECT_STATUSES: ProjectStatus[] = ["Planning", "In Progress", "On Hold", "Completed", "Archived"];

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<ProjectStatus>("Planning"); // Default status
  const [categoriesInput, setCategoriesInput] = useState(''); // Comma-separated string
  const [tagsInput, setTagsInput] = useState('');             // Comma-separated string
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset all fields when modal is closed or opened
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setStatus("Planning");
      setCategoriesInput('');
      setTagsInput('');
      setError(null);
      setSuccessMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Start and End dates are required.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
        setError("End date cannot be before start date.");
        return;
    }
    if (!status) {
      setError("Status is required.");
      return;
    }

    setIsSubmitting(true);

    const categoriesArray: Category[] = categoriesInput
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat)
      .map(catName => ({ id: catName.toLowerCase().replace(/\s+/g, '-'), name: catName, color: 'gray' })); // Placeholder color/id logic

    const tagsArray: Tag[] = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag)
      .map(tagName => ({ id: tagName.toLowerCase().replace(/\s+/g, '-'), name: tagName, color: 'gray' })); // Placeholder color/id logic
    
    const projectData: Omit<NewProjectData, 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim(),
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: Timestamp.fromDate(new Date(endDate)),
      status: status,
      categories: categoriesArray,
      tags: tagsArray,
      userIds: ["user123_placeholder"], // Placeholder, replace with actual user ID later
    };

    try {
      await addProject(projectData);
      setSuccessMessage("Project created successfully!");
      if (onProjectCreated) {
        onProjectCreated();
      }
      // Keep modal open for a moment to show success, then close
      setTimeout(() => {
        onClose(); 
      }, 1500);
    } catch (err) {
      console.error("Failed to create project:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      // For success, modal closes after timeout. For error, keep it open.
      if (!(error === null && successMessage !== null)) {
          setIsSubmitting(false);
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => !isSubmitting && onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-background border border-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-foreground flex justify-between items-center">
                  Create New Project
                  <button
                    type="button"
                    onClick={() => !isSubmitting && onClose()}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-gray-700/50 disabled:opacity-50"
                    disabled={isSubmitting}
                    aria-label="Close modal"
                  >
                    <XIcon size={24} />
                  </button>
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="project-title" className="block text-sm font-medium text-muted-foreground mb-1">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="project-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 placeholder-gray-500"
                      placeholder="e.g., Marketing Campaign Q3"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="project-description" className="block text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </label>
                    <textarea
                      id="project-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 placeholder-gray-500"
                      placeholder="Provide a brief overview of the project..."
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="project-start-date" className="block text-sm font-medium text-muted-foreground mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="project-start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 placeholder-gray-500"
                        disabled={isSubmitting}
                        min={new Date().toISOString().split('T')[0]} 
                      />
                    </div>
                    <div>
                      <label htmlFor="project-end-date" className="block text-sm font-medium text-muted-foreground mb-1">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="project-end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 placeholder-gray-500"
                        disabled={isSubmitting}
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="project-status" className="block text-sm font-medium text-muted-foreground mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="project-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                        disabled={isSubmitting}
                        className="w-full appearance-none bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 pr-8"
                      >
                        {PROJECT_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="project-categories" className="block text-sm font-medium text-muted-foreground mb-1">
                      Categories <span className="text-xs">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      id="project-categories"
                      value={categoriesInput}
                      onChange={(e) => setCategoriesInput(e.target.value)}
                      className="w-full bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 placeholder-gray-500"
                      placeholder="e.g., Marketing, Development, Design"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="project-tags" className="block text-sm font-medium text-muted-foreground mb-1">
                      Tags <span className="text-xs">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      id="project-tags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full bg-gray-800/60 border border-gray-600 text-foreground rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-150 placeholder-gray-500"
                      placeholder="e.g., Urgent, Q4, Internal"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Assign Users</label>
                    <p className="text-sm text-gray-500 bg-gray-800/30 p-3 rounded-lg border border-dashed border-gray-600">
                      User assignment functionality will be available soon.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center text-sm text-red-400 bg-red-900/30 border border-red-700/50 p-3 rounded-lg">
                      <ExclamationCircleIcon size={20} className="mr-2 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  {successMessage && (
                     <div className="flex items-center text-sm text-green-400 bg-green-900/30 border border-green-700/50 p-3 rounded-lg">
                      <CheckCircleIcon size={20} className="mr-2 flex-shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => !isSubmitting && onClose()}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors duration-150 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !!successMessage} 
                      className="px-6 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-150 disabled:opacity-60 flex items-center"
                    >
                      {isSubmitting && !successMessage ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : successMessage ? 'Project Created!' : 'Save Project'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectFormModal;
