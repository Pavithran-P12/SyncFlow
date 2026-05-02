import { useMemo } from 'react';
import { Layers, Activity, Wifi, WifiOff } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const VisibilityPanel = () => {
  const { tasks, firebaseConnected } = useTasks();

  const activeTasks = useMemo(() => tasks.filter(t => t.status !== 'done'), [tasks]);

  const memberStats = useMemo(() => {
    const stats = activeTasks.reduce((acc, task) => {
      acc[task.owner] = (acc[task.owner] || 0) + 1;
      return acc;
    }, {});

    // Add dummy members if they don't have tasks just to show a list
    const allMembers = ['Me', 'Alice', 'Bob', 'Charlie'];
    allMembers.forEach(m => {
      if (stats[m] === undefined) stats[m] = 0;
    });

    return stats;
  }, [activeTasks]);

  return (
    <aside className="visibility-panel glass-panel" aria-label="Team visibility panel">
      <div className="panel-header">
        <h1 className="text-gradient">
          <Layers size={24} color="var(--accent-primary)" aria-hidden="true" />
          SyncFlow
        </h1>
        <p>Real-Time Coordination</p>
        <div className={`connection-status ${firebaseConnected ? 'connected' : 'disconnected'}`} aria-live="polite">
          {firebaseConnected ? <Wifi size={12} aria-hidden="true" /> : <WifiOff size={12} aria-hidden="true" />}
          <span>{firebaseConnected ? 'Synced' : 'Offline'}</span>
        </div>
      </div>

      <nav className="team-list" aria-label="Team activity overview">
        <h3>
          <Activity size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} aria-hidden="true" />
          Team Activity
        </h3>
        
        {Object.entries(memberStats).map(([member, count]) => (
          <div key={member} className="team-member" role="listitem" aria-label={`${member}: ${count} active tasks`}>
            <div className="member-info">
              <div className="avatar" aria-hidden="true">
                {member.charAt(0).toUpperCase()}
              </div>
              <span>{member}</span>
            </div>
            {count > 0 ? (
              <span className={`task-count ${count > 2 ? 'overloaded' : ''}`}>
                {count} active
              </span>
            ) : (
              <span className="task-count idle">
                Clear
              </span>
            )}
          </div>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.7 }}>
        <p>Pro Tip: Type a message like "I am fixing the header" to instantly generate a task.</p>
      </div>
    </aside>
  );
};
