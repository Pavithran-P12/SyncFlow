# SyncFlow MVP - Co-Instruction & Technical Handoff Document

**Purpose:** This document is intended for other AI agents or developers to quickly understand the technical architecture, decisions made, and current state of the **SyncFlow** project.

---

## 1. Project Overview
**SyncFlow** is a lightweight, real-time team coordination layer that converts natural language communication into actionable tasks. It features a Kanban-style board, a real-time team visibility panel, and blocker highlighting.

## 2. Technology Stack
*   **Frontend Framework:** React (initialized via Vite)
*   **Styling:** Vanilla CSS (`src/index.css`, `src/App.css`) with premium dark mode, glassmorphism, and micro-animations.
*   **State Management:** React Context API (`src/context/TaskContext.jsx`)
*   **Database / Real-Time Sync:** Firebase Firestore (`src/services/firebase.js`)
*   **Security (XSS):** DOMPurify (used in message parser)
*   **Testing:** Vitest + React Testing Library (`src/utils/parser.test.js`)
*   **Icons:** Lucide-React

---

## 3. Architecture & File Structure

The codebase is highly modularized for evaluation readiness:

### `/src/components/`
*   **`TaskBoard.jsx`**: Renders the Kanban columns (To-Do, In-Progress, Done) and handles drag-and-drop logic for changing status.
*   **`TaskCard.jsx`**: Displays individual task data. Includes timestamps and an `AlertCircle` button to toggle the "Blocked" status. **Optimization:** Wrapped in `React.memo` to prevent unnecessary re-renders. Accessible via `aria-label` tags.
*   **`MessageInput.jsx`**: A form taking natural language input. Submits to the parser.
*   **`VisibilityPanel.jsx`**: Sidebar calculating and displaying active task counts per team member based on current context state.

### `/src/context/`
*   **`TaskContext.jsx`**: The core state engine. 
    *   Listens to Firestore via `subscribeToTasks`.
    *   **Resilience:** Falls back to `localStorage` if Firebase is disconnected or empty.
    *   **Optimization:** Uses `useCallback` for all mutating functions (`addTask`, `updateTaskStatus`, `toggleBlocker`) and `useMemo` for the context provider value to maximize efficiency.

### `/src/services/`
*   **`firebase.js`**: Handles Firebase app initialization using `import.meta.env` secrets. Exports pure functions for Firestore interactions: `subscribeToTasks` (real-time listener using `onSnapshot`), `createTask`, and `updateTask`.

### `/src/utils/`
*   **`parser.js`**: Contains the pure function `parseMessage(rawMessage)`.
    *   **Security:** Runs `DOMPurify.sanitize()` first.
    *   **Logic:** Extracts the task action (title), the owner (e.g., "Alice is working on..." -> Owner: Alice), and removes redundant timeframe words.

---

## 4. Current State & Configuration

1.  **Environment Variables:** Firebase credentials have been successfully injected into the local `.env` file connecting to the `hack2skill-89f79` Firebase project.
2.  **Evaluation Readiness:** The app has been refactored to meet strict evaluation criteria:
    *   **Code Quality:** Modular structure, pure functions.
    *   **Security:** XSS sanitization, no hardcoded secrets in Git.
    *   **Efficiency:** Aggressive memoization.
    *   **Accessibility:** Semantic HTML and ARIA labels.
    *   **Testing:** Unit tests written for the parser.

## 5. Instructions for Future Agents
*   **Styling:** Maintain Vanilla CSS. Do NOT introduce Tailwind CSS unless explicitly requested by the user. Rely on the CSS variables defined in `:root` inside `index.css`.
*   **Testing:** Use `npm run test` (Vitest). If writing new UI tests, use `@testing-library/react`.
*   **Real-time Logic:** When adding new features, prefer updating Firestore through `src/services/firebase.js` and allowing the `onSnapshot` listener in `TaskContext` to naturally propagate the state down to the UI, rather than manually mutating local state first.
