import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { parseMessageAndAddTask } = useTasks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    parseMessageAndAddTask(message);
    setMessage('');
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="input-wrapper">
        <Zap size={20} className="icon" />
        <input
          type="text"
          className="message-input"
          placeholder="Type an update... e.g. 'I will fix login bug by today'"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
          type="submit" 
          className="submit-btn"
          disabled={!message.trim()}
        >
          Create Task
        </button>
      </form>
    </div>
  );
};
