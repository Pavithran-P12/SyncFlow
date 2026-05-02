import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { VisibilityPanel } from './components/VisibilityPanel';
import { MessageInput } from './components/MessageInput';
import { TaskBoard } from './components/TaskBoard';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <div className="app-container">
        <VisibilityPanel />
        
        <main className="main-content">
          <MessageInput />
          <TaskBoard />
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;
