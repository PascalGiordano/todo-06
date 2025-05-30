"use client";

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { Task, TaskPriority } from '../../types/task';
import { UserIcon, CalendarDaysIcon, ShieldAlertIcon, ChevronUpIcon, ChevronsUpIcon, FlagIcon } from 'lucide-react'; // Removed GripVerticalIcon for now
import { format, isPast, isToday } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface TaskCardProps {
  task: Task;
  index: number;
}

const getPriorityStyles = (priority: TaskPriority): { icon: React.ElementType, colorClass: string, label: string } => {
  switch (priority) {
    case 'Urgent':
      return { icon: ShieldAlertIcon, colorClass: 'text-red-400', label: 'Urgent' };
    case 'High':
      return { icon: ChevronsUpIcon, colorClass: 'text-orange-400', label: 'High' };
    case 'Medium':
      return { icon: ChevronUpIcon, colorClass: 'text-yellow-400', label: 'Medium' };
    case 'Low':
      return { icon: FlagIcon, colorClass: 'text-sky-400', label: 'Low' };
    default: // Should not happen with TaskPriority type, but good for safety
      return { icon: FlagIcon, colorClass: 'text-gray-400', label: priority };
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  if (!task) {
    console.warn(`TaskCard received undefined task at index ${index}. This might be a temporary state during reorder or a data inconsistency.`);
    return null; 
  }

  const { icon: PriorityIcon, colorClass: priorityColor, label: priorityLabel } = getPriorityStyles(task.priority);

  const formattedDueDate = task.dueDate && task.dueDate instanceof Timestamp 
    ? format(task.dueDate.toDate(), 'MMM d') 
    : task.dueDate // Assuming it might already be a string if not a Timestamp, or null
    ? format(new Date(task.dueDate as any), 'MMM d') // Attempt to parse if string, 'as any' to bypass strict Timestamp type if already string
    : null;
  
  const dueDateAsDate = task.dueDate instanceof Timestamp ? task.dueDate.toDate() : (task.dueDate ? new Date(task.dueDate as any) : null);
  const isOverdue = dueDateAsDate && isPast(dueDateAsDate) && !isToday(dueDateAsDate);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-gray-700/60 p-3.5 rounded-lg shadow-sm mb-3 border border-gray-600/80 hover:border-primary/60
            ${snapshot.isDragging ? 'ring-2 ring-primary shadow-xl bg-gray-600/80 scale-105' : ''}
            transition-all duration-150 ease-in-out cursor-grab active:cursor-grabbing`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Title */}
          <p className="text-sm font-medium text-foreground/95 break-words mb-2.5">
            {task.title}
          </p>

          {/* Tags - Optional display */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {task.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-600 text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Row: Priority, Assignees, Due Date */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            {/* Priority Indicator */}
            <div className={`flex items-center ${priorityColor}`} title={`Priority: ${priorityLabel}`}>
              <PriorityIcon size={15} className="mr-1" />
              {/* Optionally display label: <span className="font-medium">{priorityLabel}</span> */}
            </div>

            <div className="flex items-center space-x-2">
              {/* Due Date */}
              {formattedDueDate && (
                <div className={`flex items-center ${isOverdue ? 'text-red-400 font-semibold' : 'text-muted-foreground'}`} title={`Due: ${formattedDueDate}`}>
                  <CalendarDaysIcon size={14} className="mr-1" />
                  <span>{formattedDueDate}</span>
                </div>
              )}

              {/* Assignees Placeholder */}
              {task.assigneeIds && task.assigneeIds.length > 0 && (
                <div className="flex -space-x-2 items-center" title={`Assigned to ${task.assigneeIds.length} user(s)`}>
                  {task.assigneeIds.slice(0, 2).map((assigneeId) => ( 
                     <div key={assigneeId} className="w-5 h-5 bg-gray-500 rounded-full border-2 border-gray-700/80 flex items-center justify-center text-xs text-white font-semibold">
                       <UserIcon size={10}/>
                     </div>
                  ))}
                  {task.assigneeIds.length > 2 && (
                     <div className="w-5 h-5 bg-gray-600 rounded-full border-2 border-gray-700/80 flex items-center justify-center text-xs text-white">
                       +{task.assigneeIds.length - 2}
                     </div>
                  )}
                </div>
              )}
               {/* Empty div to maintain alignment if no assignees and no due date AND no priority (though priority is always there) */}
               {(!task.assigneeIds || task.assigneeIds.length === 0) && !formattedDueDate && (
                 <div className="w-5 h-5"></div>
               )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
