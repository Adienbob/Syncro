import { AppState } from "../types/models"


const defaultState: AppState = {
   members: [],
   boards: [],
   tasks: [],
   activities: [],
   notifications: [],
}

const demoState: AppState = {
   members: [{
      id: "56b34f91-e969-4b9b-9f83-003f49ad4ced",
      boardId: "56c34f91-e969-4b9b-9f83-003f49ad4ced",
      userId: "56m34f91-e969-4b9b-9f83-003f49ad4ced",
      role: "owner",
      joinedAt: "2026-01-01"
   }], 
   boards: [{
      id: "56c34f91-e969-4b9b-9f83-003f49ad4ced",
      title: "Syncro - Development Workspace",
      createdAt: "2026-01-01"
   }],
   tasks: [
      {
         id: "task-1",
         title: "Design and implement authentication flow (Clerk integration)",
         description: "Set up Clerk authentication with sign-in, sign-up, and user session handling.",
         priority: "high",
         status: "done",
         createdAt: "2026-06-20",
         dueDate: null,
         boardId: "56c34f91-e969-4b9b-9f83-003f49ad4ced"
      },
      {
         id: "task-2",
         title: "Build core board and task management system",
         description: "Implement CRUD operations for boards and tasks using Context API.",
         priority: "high",
         status: "in-progress",
         createdAt: "2026-06-21",
         dueDate: null,
         boardId: "56c34f91-e969-4b9b-9f83-003f49ad4ced"
      },
      {
         id: "task-3",
         title: "Implement filtering, sorting, and search functionality",
         description: "Add advanced task filtering by priority, status, and text search.",
         priority: "medium",
         status: "todo",
         createdAt: "2026-06-21",
         dueDate: null,
         boardId: "56c34f91-e969-4b9b-9f83-003f49ad4ced"
      },
      {
         id: "task-4",
         title: "Enhance UX with drag and drop interaction",
         description: "Allow users to move tasks between columns (Todo, In Progress, Done).",
         priority: "medium",
         status: "todo",
         createdAt: "2026-06-21",
         dueDate: null,
         boardId: "56c34f91-e969-4b9b-9f83-003f49ad4ced"
      },
      {
         id: "task-5",
         title: "Prepare database integration layer",
         description: "Replace local state with persistent database (e.g., PostgreSQL or Firebase).",
         priority: "low",
         status: "todo",
         createdAt: "2026-06-21",
         dueDate: null,
         boardId: "56c34f91-e969-4b9b-9f83-003f49ad4ced"
      },
      {
         id: "task-6",
         title: "Deploy Syncro to production",
         description: "Deploy the application using Vercel and configure environment variables.",
         priority: "low",
         status: "todo",
         createdAt: "2026-06-21",
         dueDate: null,
         boardId: "56c34f91-e969-4b9b-9f83-003f49ad4ced"
      }
   ],
   activities: [],
   notifications: []
}

export { defaultState, demoState }