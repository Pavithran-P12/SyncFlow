import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
    <div className="app-container" role="main">
      <VisibilityPanel />
      <main className="main-content" aria-label="Task management area">
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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
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
