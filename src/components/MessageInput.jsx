import { useState, useMemo } from 'react';
import { Zap, User, FileText } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { parseMessage } from '../utils/parser';

export const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { parseMessageAndAddTask } = useTasks();

  const preview = useMemo(() => {
    if (!message.trim()) return null;
    return parseMessage(message);
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    parseMessageAndAddTask(message);
    setMessage('');
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="input-wrapper" role="form" aria-label="Create task from message">
        <Zap size={20} className="icon" aria-hidden="true" />
        <label htmlFor="task-message-input" className="sr-only">Type a task update</label>
        <input
          id="task-message-input"
          type="text"
          className="message-input"
          placeholder="Type an update... e.g. 'I will fix login bug by today'"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-describedby={preview ? 'task-preview' : undefined}
        />
        <button 
          type="submit" 
          className="submit-btn"
          disabled={!message.trim()}
          aria-label="Create task"
        >
          Create Task
        </button>
      </form>
      {preview && preview.title && (
        <div id="task-preview" className="parser-preview" aria-live="polite">
          <span className="preview-label">Preview:</span>
          <span className="preview-item"><FileText size={12} aria-hidden="true" /> {preview.title}</span>
          <span className="preview-item"><User size={12} aria-hidden="true" /> {preview.owner}</span>
        </div>
      )}
    </div>
  );
};
