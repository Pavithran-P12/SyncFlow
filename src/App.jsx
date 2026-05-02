import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { VisibilityPanel } from './components/VisibilityPanel';
import { MessageInput } from './components/MessageInput';
import { TaskBoard } from './components/TaskBoard';
import './App.css';

// The main Kanban application layout
const AppLayout = () => {
  return (
    <div className="app-container">
      <VisibilityPanel />
      <main className="main-content">
        <MessageInput />
        <TaskBoard />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
