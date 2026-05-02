import React, { memo } from 'react';
import { AlertCircle, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskCard = memo(({ task }) => {
  const { toggleBlocker, updateTaskStatus } = useTasks();

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const cycleStatus = () => {
    const statuses = ['todo', 'in-progress', 'done'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateTaskStatus(task.id, nextStatus);
  };

  const getStatusIcon = () => {
    if (task.status === 'done') return <CheckCircle2 size={16} color="var(--status-done)" />;
    if (task.status === 'in-progress') return <Clock size={16} color="var(--status-progress)" />;
    return <Circle size={16} color="var(--status-todo)" />;
  };

  return (
    <div 
      className={`task-card ${task.isBlocked ? 'blocked' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="card-header">
        <h3 className="card-title">{task.title}</h3>
      </div>
      
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Created: {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      <div className="card-footer">
        <div className="card-owner">
          <div className="owner-avatar">
            {task.owner.charAt(0).toUpperCase()}
          </div>
          <span>{task.owner}</span>
        </div>
        
        <div className="card-actions">
          <button 
            className="icon-btn" 
            onClick={cycleStatus}
            title="Cycle Status"
            aria-label={`Cycle status for task: ${task.title}`}
          >
            {getStatusIcon()}
          </button>
          <button 
            className={`icon-btn ${task.isBlocked ? 'blocked-btn' : ''}`}
            onClick={() => toggleBlocker(task.id)}
            title="Mark as blocked"
            aria-label={`${task.isBlocked ? 'Unblock' : 'Block'} task: ${task.title}`}
          >
            <AlertCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
