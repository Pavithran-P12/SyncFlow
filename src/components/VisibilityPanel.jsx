import React from 'react';
import { Layers, Activity } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const VisibilityPanel = () => {
  const { tasks } = useTasks();

  // Calculate active tasks per member
  const activeTasks = tasks.filter(t => t.status !== 'done');
  
  const memberStats = activeTasks.reduce((acc, task) => {
    acc[task.owner] = (acc[task.owner] || 0) + 1;
    return acc;
  }, {});

  // Add dummy members if they don't have tasks just to show a list
  const allMembers = ['Me', 'Alice', 'Bob', 'Charlie'];
  allMembers.forEach(m => {
    if (memberStats[m] === undefined) memberStats[m] = 0;
  });

  return (
    <div className="visibility-panel glass-panel">
      <div className="panel-header">
        <h1 className="text-gradient">
          <Layers size={24} color="var(--accent-primary)" />
          SyncFlow
        </h1>
        <p>Real-Time Coordination</p>
      </div>

      <div className="team-list">
        <h3>
          <Activity size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Team Activity
        </h3>
        
        {Object.entries(memberStats).map(([member, count]) => (
          <div key={member} className="team-member">
            <div className="member-info">
              <div className="avatar">
                {member.charAt(0).toUpperCase()}
              </div>
              <span>{member}</span>
            </div>
            {count > 0 ? (
              <span className="task-count" style={{ color: count > 2 ? 'var(--status-progress)' : 'var(--text-secondary)' }}>
                {count} active
              </span>
            ) : (
              <span className="task-count" style={{ opacity: 0.5 }}>
                Clear
              </span>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: 'auto', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.7 }}>
        <p>Pro Tip: Type a message like "I am fixing the header" to instantly generate a task.</p>
      </div>
    </div>
  );
};
