"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { getProjects } from '@/lib/firebaseStore/projects';
import type { Project } from '@/types/project';
import { format } from 'date-fns';
import ProjectFormModal from '@/components/projects/project-form-modal'; // Updated import

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies, fetchProjects itself is stable

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = () => {
    // Re-fetch projects when a new one is created
    fetchProjects();
  };

  const formatDate = (timestamp: any): string => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return format(timestamp.toDate(), 'PPP');
    }
    if (timestamp instanceof Date) {
      return format(timestamp, 'PPP');
    }
    return timestamp ? String(timestamp) : 'N/A';
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
        >
          <PlusCircle size={20} className="mr-2" />
          Create New Project
        </button>
      </div>

      <ProjectFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">Loading projects...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Error Fetching Projects</h2>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-foreground">No projects yet</h3>
          <p className="mt-1 text-md text-muted-foreground">
            Get started by creating a new project.
          </p>
          <div className="mt-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 mx-auto"
            >
              <PlusCircle size={20} className="mr-2" />
              Create New Project
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm hover:border-primary/80 transition-all duration-200 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2 truncate" title={project.title}>
                  <Link href={`/projects/${project.id}`} className="hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded">
                    {project.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground mb-1">
                  <span className="font-medium text-gray-400">Status:</span> {project.status}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium text-gray-400">Due:</span> {formatDate(project.endDate)}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-end">
                <Link href={`/projects/${project.id}/edit`} passHref>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium py-1 px-3 rounded-md hover:bg-primary/10 transition-colors">
                    Edit Project
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProjectsPage;
