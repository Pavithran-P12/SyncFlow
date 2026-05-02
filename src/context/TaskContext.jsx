import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { parseMessage } from '../utils/parser';
import { useAuth } from './AuthContext';
import { subscribeToTasks, createTask, updateTask } from '../services/firebase';

const TaskContext = createContext();

const initialTasks = [
  {
    id: '1',
    title: 'Design database schema',
    owner: 'Alice',
    status: 'done',
    isBlocked: false,
    createdAt: Date.now() - 100000,
  },
  {
    id: '2',
    title: 'Implement login API',
    owner: 'Bob',
    status: 'in-progress',
    isBlocked: false,
    createdAt: Date.now() - 50000,
  },
  {
    id: '3',
    title: 'Fix Safari rendering bug',
    owner: 'Charlie',
    status: 'todo',
    isBlocked: true,
    createdAt: Date.now() - 10000,
  }
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isFirebaseActive, setIsFirebaseActive] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Attempt Firebase Subscription
    const unsubscribe = subscribeToTasks((firebaseTasks) => {
      if (firebaseTasks.length > 0) {
        setTasks(firebaseTasks);
        setIsFirebaseActive(true);
      } else {
        // Fallback to local storage if Firebase is empty/missing for the demo
        const saved = localStorage.getItem('syncflow_tasks');
        if (saved) {
          try {
            setTasks(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to local storage as a backup if Firebase isn't handling it
  useEffect(() => {
    if (!isFirebaseActive) {
      localStorage.setItem('syncflow_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isFirebaseActive]);

  const addTask = useCallback(async (taskData) => {
    let finalOwner = taskData.owner || 'Me';
    if (finalOwner === 'Me' && user) {
      finalOwner = user.displayName || user.email.split('@')[0];
    }
    
    const newTask = {
      title: taskData.title,
      owner: finalOwner,
      status: taskData.status || 'todo',
      isBlocked: false,
      createdAt: Date.now(),
    };

    if (isFirebaseActive) {
      await createTask(newTask);
    } else {
      newTask.id = Math.random().toString(36).substr(2, 9);
      setTasks(prev => [...prev, newTask]);
    }
  }, [isFirebaseActive]);

  const updateTaskStatus = useCallback(async (id, newStatus) => {
    if (isFirebaseActive) {
      await updateTask(id, { status: newStatus });
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  }, [isFirebaseActive]);

  const toggleBlocker = useCallback(async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    if (isFirebaseActive) {
      await updateTask(id, { isBlocked: !task.isBlocked });
    } else {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, isBlocked: !t.isBlocked } : t));
    }
  }, [isFirebaseActive, tasks]);

  const parseMessageAndAddTask = useCallback((message) => {
    const parsedData = parseMessage(message);
    if (parsedData) {
      addTask(parsedData);
    }
  }, [addTask]);

  const contextValue = useMemo(() => ({
    tasks,
    addTask,
    updateTaskStatus,
    toggleBlocker,
    parseMessageAndAddTask
  }), [tasks, addTask, updateTaskStatus, toggleBlocker, parseMessageAndAddTask]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
