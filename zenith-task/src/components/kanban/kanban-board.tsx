"use client";

import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult, OnDragEndResponder } from '@hello-pangea/dnd'; // Removed Draggable
import { Timestamp } from 'firebase/firestore';

// Import the new Task interface and TaskPriority type
import type { Task, TaskPriority } from '../../types/task'; // Using relative path

// Define TypeScript interfaces for board data (Column and BoardData remain, Task is imported)
export interface Column { // Keep Column and BoardData local if they are specific to Kanban view
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: { [taskId: string]: Task }; // Use imported Task type
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}

import TaskCard from './task-card'; // Import the TaskCard component

// Sample Project ID (replace with actual dynamic projectId later)
const SAMPLE_PROJECT_ID = 'project123';

// Initial static data for the board using the new Task structure
const initialData: BoardData = {
  tasks: {
    'task-1': { 
      id: 'task-1', 
      title: 'Design homepage mockups and wireframes', 
      priority: 'High' as TaskPriority,
      status: 'column-2', // To Do
      projectId: SAMPLE_PROJECT_ID,
      assigneeIds: ['user-a'],
      dueDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 7))), 
      createdAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 2))), // Created 2 days ago
      updatedAt: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 1))), // Updated 1 day ago
      description: 'Detailed mockups needed for all screen sizes, including mobile and tablet views. Focus on modern aesthetics and user experience.',
      tags: ['UI/UX', 'Design System', 'Mobile']
    },
    'task-2': { 
      id: 'task-2', 
      title: 'Develop API endpoints for user authentication', 
      priority: 'Urgent' as TaskPriority,
      status: 'column-2', // To Do
      projectId: SAMPLE_PROJECT_ID,
      assigneeIds: ['user-b'],
      dueDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 3))), 
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      description: 'Implement JWT-based authentication with refresh tokens. Include endpoints for register, login, logout, and password reset.',
    },
    'task-3': { 
      id: 'task-3', 
      title: 'Write user documentation for the new feature', 
      priority: 'Medium' as TaskPriority,
      status: 'column-3', // In Progress
      projectId: SAMPLE_PROJECT_ID,
      assigneeIds: ['user-c'],
      dueDate: null,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      tags: ['Documentation']
    },
    'task-4': { 
      id: 'task-4', 
      title: 'Test payment gateway integration on staging', 
      priority: 'High' as TaskPriority,
      status: 'column-4', // Done
      projectId: SAMPLE_PROJECT_ID,
      assigneeIds: ['user-b', 'user-d'],
      dueDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 2))), 
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    },
    'task-5': { 
      id: 'task-5', 
      title: 'Plan sprint #3 tasks and user stories', 
      priority: 'Medium' as TaskPriority,
      status: 'column-1', // Backlog
      projectId: SAMPLE_PROJECT_ID,
      assigneeIds: [],
      dueDate: null,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      description: 'Gather requirements and define user stories for the upcoming sprint. Estimate effort for each task.',
      tags: ['Planning', 'Agile']
    },
    'task-6': { 
      id: 'task-6', 
      title: 'Refactor old codebase for performance improvements', 
      priority: 'Low' as TaskPriority,
      status: 'column-3', // In Progress
      projectId: SAMPLE_PROJECT_ID,
      assigneeIds: ['user-a'],
      dueDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() + 14))), 
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    },
    'task-7': { 
      id: 'task-7', 
      title: 'Deploy version 2.1 to production server', 
      priority: 'Urgent' as TaskPriority,
      status: 'column-4', // Done
      projectId: SAMPLE_PROJECT_ID,
      assigneeIds: ['user-d'],
      dueDate: Timestamp.fromDate(new Date(new Date().setDate(new Date().getDate() - 5))), 
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      description: 'Prepare deployment scripts and execute deployment during off-peak hours. Monitor logs post-deployment.',
    },
  },
  columns: {
    'column-1': { id: 'column-1', title: 'Backlog', taskIds: ['task-5'] },
    'column-2': { id: 'column-2', title: 'To Do', taskIds: ['task-1', 'task-2'] },
    'column-3': { id: 'column-3', title: 'In Progress', taskIds: ['task-6', 'task-3'] },
    'column-4': { id: 'column-4', title: 'Done', taskIds: ['task-4', 'task-7'] },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

interface KanbanBoardProps {
  projectId: string; 
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [boardData, setBoardData] = useState<BoardData>(initialData);

  const onDragEnd: OnDragEndResponder = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Handle No Destination
    if (!destination) {
      console.log('Task dropped outside a valid destination (no destination).');
      return;
    }

    // Handle No Change
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('Task dropped in the same position.');
      return;
    }
    
    // Log Drag Details for a valid change - can be commented out after verification
    // console.log('Task drag operation complete:');
    // console.log(`  Draggable ID (Task ID): ${draggableId}`);
    // console.log(`  Source Column ID: ${source.droppableId}`);
    // console.log(`  Source Index: ${source.index}`);
    // console.log(`  Destination Column ID: ${destination.droppableId}`);
    // console.log(`  Destination Index: ${destination.index}`);

    const startColumn = boardData.columns[source.droppableId];
    const finishColumn = boardData.columns[destination.droppableId];

    // Case 1: Reordering within the same column
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1); // Remove task from old position
      newTaskIds.splice(destination.index, 0, draggableId); // Insert task into new position

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setBoardData(prevData => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [newColumn.id]: newColumn,
        },
      }));
      return;
    }

    // Case 2: Moving from one column to another
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1); // Remove task from source column
    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId); // Insert task into destination column
    const newFinishColumn = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    setBoardData(prevData => ({
      ...prevData,
      columns: {
        ...prevData.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    }));

    // TODO: PERSISTENCE - API Call Needed Here
    // The 'draggableId' is the ID of the task that was moved.
    // 'source.droppableId' is the ID of the column it came from.
    // 'destination.droppableId' is the ID of the column it moved to.
    // 'source.index' is its old position in the source column's taskIds array.
    // 'destination.index' is its new position in the destination column's taskIds array.

    // 1. If task moved within the same column (startColumn.id === finishColumn.id, handled above by `startColumn === finishColumn`):
    //    - The `newColumn.taskIds` (which is `finishColumn.taskIds` after splice) reflects the new order.
    //    - API Call: Update the task order for column `finishColumn.id` on the backend.
    //      Example: `updateColumnTaskOrder(finishColumn.id, finishTaskIds)`
    //      This might involve updating an array of task IDs/references stored with the column document.
    //      Alternatively, if tasks have an 'order' field, update that for all affected tasks in the column.

    // 2. If task moved to a different column (startColumn.id !== finishColumn.id):
    //    - `newStartColumn.taskIds` (which is `startTaskIds`) has the task removed.
    //    - `newFinishColumn.taskIds` (which is `finishTaskIds`) has the task added at the new position.
    //    - API Call:
    //        a. Update task order for `newStartColumn.id` (e.g., `updateColumnTaskOrder(newStartColumn.id, startTaskIds)`).
    //        b. Update task order for `newFinishColumn.id` (e.g., `updateColumnTaskOrder(newFinishColumn.id, finishTaskIds)`).
    //        c. Update the 'status' field of the moved task (`draggableId`) to reflect its new column.
    //           The new status could be `newFinishColumn.id` or `newFinishColumn.title`.
    //           Example: `updateTaskStatus(draggableId, newFinishColumn.id)` or `updateTask(draggableId, { status: newFinishColumn.id })`
    //    - Consider using a batched write in Firestore if multiple documents (columns and the task itself) are updated.
    //      This ensures atomicity. Example:
    //      `const batch = writeBatch(db);`
    //      `batch.update(doc(db, "columns", newStartColumn.id), { taskIds: startTaskIds });`
    //      `batch.update(doc(db, "columns", newFinishColumn.id), { taskIds: finishTaskIds });`
    //      `batch.update(doc(db, "tasks", draggableId), { status: newFinishColumn.id, updatedAt: serverTimestamp() });`
    //      `await batch.commit();`
    //
    // Note: The actual structure of your Firestore data (whether columns store task IDs, or tasks store column IDs and order)
    // will dictate the exact API calls. The current `boardData` state implies columns store an array of `taskIds`.
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 p-4 overflow-x-auto h-full min-h-[calc(100vh-200px)] items-start">
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasksInColumn = column.taskIds.map(taskId => boardData.tasks[taskId]).filter(task => task); // Filter out undefined tasks

          return (
            <Droppable key={column.id} droppableId={column.id} type="TASK">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
import { PlusIcon } from 'lucide-react'; // Import PlusIcon

// ... (rest of the existing imports and interfaces)

// ... (initialData remains the same)

// ... (KanbanBoardProps remains the same)

// ... (KanbanBoard component definition)

// ... (onDragEnd handler remains the same)
                  className={`bg-gray-800/70 rounded-lg p-4 w-80 flex-shrink-0 shadow-md
                    ${snapshot.isDraggingOver ? 'bg-primary/10 border border-dashed border-primary' : 'border border-transparent'}
                    transition-colors duration-200 ease-in-out flex flex-col`} 
                >
                  <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-semibold text-foreground">{column.title}</h2>
                    <button 
                      onClick={() => console.log('Attempting to create a new task in column:', column.id, column.title)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-primary/20 rounded-md transition-colors"
                      aria-label={`Add task to ${column.title}`}
                      title={`Add task to ${column.title}`}
                    >
                      <PlusIcon size={20} />
                    </button>
                  </div>
                  <div 
                    className="min-h-[200px] space-y-3 flex-grow"
                  >
                    {tasksInColumn.map((task, index) => (
                      <TaskCard key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                    {tasksInColumn.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground/70">
                            <p>Drag tasks here or create a new one.</p>
                        </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
