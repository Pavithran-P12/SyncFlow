import React from 'react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from './TaskCard';

export const TaskBoard = () => {
  const { tasks, updateTaskStatus } = useTasks();

  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'done', title: 'Done', status: 'done' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  return (
    <div className="task-board">
      {columns.map(col => {
        const columnTasks = tasks.filter(t => t.status === col.status).sort((a, b) => b.createdAt - a.createdAt);
        
        return (
          <div 
            key={col.id} 
            className="board-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            <div className="column-header">
              <h2>
                <div className={`status-dot ${col.status}`}></div>
                {col.title}
              </h2>
              <span className="column-count">{columnTasks.length}</span>
            </div>
            
            <div className="column-content">
              {columnTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
