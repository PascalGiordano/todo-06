"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // useParams for dynamic route, useRouter for navigation
import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, TagIcon, FolderIcon, CheckCircleIcon, InfoIcon, Edit3Icon } from 'lucide-react'; // Example icons
import DashboardLayout from '@/components/layout/dashboard-layout';
import { getProjectById } from '@/lib/firebaseStore/projects';
import type { Project, Category, Tag } from '@/types/project';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const fetchedProject = await getProjectById(projectId);
          if (fetchedProject) {
            setProject(fetchedProject);
          } else {
            setError('Project not found.');
          }
        } catch (err) {
          console.error("Error fetching project:", err);
          setError(err instanceof Error ? err.message : 'Failed to fetch project details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProject();
    } else {
      // Handle case where projectId is not available (should not happen with Next.js file routing)
      setError("Project ID is missing.");
      setIsLoading(false);
    }
  }, [projectId]);

  const formatDate = (timestamp: Timestamp | Date | string | undefined): string => {
    if (!timestamp) return 'N/A';
    if (timestamp instanceof Timestamp) {
      return format(timestamp.toDate(), 'MMMM d, yyyy');
    }
    if (timestamp instanceof Date) {
      return format(timestamp, 'MMMM d, yyyy');
    }
    // Attempt to parse if it's a string (less ideal)
    try {
      return format(new Date(timestamp), 'MMMM d, yyyy');
    } catch {
      return String(timestamp); // Fallback
    }
  };
  
  const renderDetailItem = (label: string, value: string | React.ReactNode, icon?: React.ElementType) => {
    const IconComponent = icon;
    return (
      <div className="mb-3">
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          {IconComponent && <IconComponent size={16} className="mr-2 text-primary" />}
          <span>{label}</span>
        </div>
        {typeof value === 'string' ? <p className="text-foreground text-md">{value || 'N/A'}</p> : value}
      </div>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-lg text-muted-foreground">Loading project details...</p>
          {/* Spinner can be added here */}
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <InfoIcon size={48} className="text-red-500 mb-4" />
          <p className="text-xl text-red-400 mb-2">Error</p>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/projects" className="flex items-center text-primary hover:text-primary/80 font-medium">
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    // This case should ideally be covered by the error 'Project not found'
    // but as a fallback:
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
           <InfoIcon size={48} className="text-yellow-500 mb-4" />
          <p className="text-xl text-muted-foreground">Project data not available.</p>
           <Link href="/projects" className="mt-6 flex items-center text-primary hover:text-primary/80 font-medium">
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Projects
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Edit Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => router.back()} // Or use Link href="/projects"
            className="flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ArrowLeftIcon size={18} className="mr-2" />
            Back to Projects
          </button>
          <Link href={`/projects/${project.id}/edit`} passHref>
             <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 text-sm">
                <Edit3Icon size={16} className="mr-2" />
                Edit Project
            </button>
          </Link>
        </div>

        {/* Project Header */}
        <div className="mb-8 p-6 bg-gray-800/30 border border-gray-700 rounded-lg">
          <h1 className="text-4xl font-bold text-foreground mb-3">{project.title}</h1>
          <p className="text-md text-muted-foreground">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              project.status === "Completed" ? 'bg-green-700/30 text-green-300' : 
              project.status === "In Progress" ? 'bg-sky-700/30 text-sky-300' :
              project.status === "Planning" ? 'bg-indigo-700/30 text-indigo-300' :
              project.status === "On Hold" ? 'bg-yellow-700/30 text-yellow-300' :
              'bg-gray-600/30 text-gray-300' // Archived or other
            }`}>
              {project.status}
            </span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (Details) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-foreground mb-4">Project Details</h2>
              {renderDetailItem("Start Date", formatDate(project.startDate), CalendarIcon)}
              {renderDetailItem("End Date", formatDate(project.endDate), CalendarIcon)}
              
              {project.categories && project.categories.length > 0 && renderDetailItem("Categories", 
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.categories.map((cat: Category) => (
                    <span key={cat.id} className="px-2.5 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600" style={{borderColor: cat.color !== 'gray' ? cat.color : undefined}}>
                      {cat.name}
                    </span>
                  ))}
                </div>, FolderIcon
              )}
              
              {project.tags && project.tags.length > 0 && renderDetailItem("Tags", 
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tags.map((tag: Tag) => (
                    <span key={tag.id} className="px-2.5 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300 border border-gray-600" style={{borderColor: tag.color !== 'gray' ? tag.color : undefined}}>
                      {tag.name}
                    </span>
                  ))}
                </div>, TagIcon
              )}
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
              {project.description ? (
                <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                  {/* For now, rendering raw markdown. TODO: Implement Markdown renderer */}
                  <pre className="whitespace-pre-wrap font-sans">{project.description}</pre>
                </div>
              ) : (
                <p className="text-muted-foreground">No description provided.</p>
              )}
            </div>
          </div>

          {/* Right Column (Meta Info & Users) */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-foreground mb-4">Meta Information</h2>
              {renderDetailItem("Created At", formatDate(project.createdAt))}
              {renderDetailItem("Last Updated", formatDate(project.updatedAt))}
              {renderDetailItem("Project ID", project.id)}
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-foreground mb-4">Assigned Users</h2>
              {project.userIds && project.userIds.length > 0 ? (
                <ul className="space-y-2">
                  {project.userIds.map(userId => (
                    <li key={userId} className="text-sm text-muted-foreground p-2 bg-gray-700/30 rounded-md">
                      {userId} {/* TODO: Fetch actual user names if a users collection exists */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No users assigned.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;
