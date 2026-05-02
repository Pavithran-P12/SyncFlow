import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

// 1. Firebase Configuration Template (Secrets in .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if config exists to prevent immediate crashes during setup
let app;
let db;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config not found. Please add .env files.");
  }
} catch (e) {
  console.error("Firebase initialization error", e);
}

// 2. Firestore Services
const TASKS_COLLECTION = 'tasks';

/**
 * Subscribe to tasks in real-time
 * @param {function} callback - Called with updated tasks array
 * @returns {function} unsubscribe function
 */
export const subscribeToTasks = (callback) => {
  if (!db) {
    console.warn("Mocking Firestore: Using empty array.");
    callback([]);
    return () => {};
  }
  
  const q = query(collection(db, TASKS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const tasksData = [];
    snapshot.forEach((doc) => {
      tasksData.push({ id: doc.id, ...doc.data() });
    });
    callback(tasksData);
  }, (error) => {
    console.error("Firestore subscription error", error);
  });
};

/**
 * Add a new task to Firestore
 * @param {Object} task - The task data
 */
export const createTask = async (task) => {
  if (!db) return;
  try {
    await addDoc(collection(db, TASKS_COLLECTION), {
      ...task,
      createdAt: Date.now()
    });
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

/**
 * Update an existing task in Firestore
 * @param {string} id - Task ID
 * @param {Object} updates - Fields to update
 */
export const updateTask = async (id, updates) => {
  if (!db) return;
  try {
    const taskRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(taskRef, updates);
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};
