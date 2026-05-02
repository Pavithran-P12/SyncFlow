import React, { useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';

const EMPTY_MESSAGES = {
  'todo': { emoji: '✨', text: 'No tasks yet. Type a message above to create one!' },
  'in-progress': { emoji: '🚀', text: 'Nothing in progress. Drag a task here to start!' },
  'done': { emoji: '🎉', text: 'All clear! Complete tasks will appear here.' }
};

export const TaskBoard = () => {
  const { tasks, updateTaskStatus } = useTasks();

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'done', title: 'Done', status: 'done' }
  ];

  const groupedTasks = useMemo(() => {
    const grouped = {};
    for (const col of columns) {
      grouped[col.status] = tasks
        .filter(t => t.status === col.status)
        .sort((a, b) => b.createdAt - a.createdAt);
    }
    return grouped;
  }, [tasks]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  return (
    <div className="task-board" role="region" aria-label="Task board">
      {columns.map(col => {
        const columnTasks = groupedTasks[col.status] || [];
        
        return (
          <div 
            key={col.id} 
            className="board-column"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
            role="list"
            aria-label={`${col.title} column with ${columnTasks.length} tasks`}
          >
            <div className="column-header">
              <h2>
                <div className={`status-dot ${col.status}`} aria-hidden="true"></div>
                {col.title}
              </h2>
              <span className="column-count" aria-label={`${columnTasks.length} tasks`}>{columnTasks.length}</span>
            </div>
            
            <div className="column-content">
              {columnTasks.length === 0 ? (
                <div className="empty-column" role="status">
                  <span className="empty-emoji">{EMPTY_MESSAGES[col.status].emoji}</span>
                  <p>{EMPTY_MESSAGES[col.status].text}</p>
                </div>
              ) : (
                columnTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
