import { AppState } from "../types/models";

const demoBoardId = "56c34f91-e969-4b9b-9f83-003f49ad4ced";

const defaultState: AppState = {
   members: [],
   boards: [],
   tasks: [],
   activities: [],
   notifications: [],
};

const demoState: AppState = {
   members: [
      {
         id: "56b34f91-e969-4b9b-9f83-003f49ad4ced",
         boardId: demoBoardId,
         userId: "demo-hussien",
         displayName: "Hussien Walid",
         imageUrl: "",
         email: "hussienwalid125@gmail.com",
         role: "owner",
         joinedAt: "2026-01-01",
      },
      {
         id: "66b34f91-e969-4b9b-9f83-003f49ad4ced",
         boardId: demoBoardId,
         userId: "demo-ahmed",
         displayName: "Ahmed Hassan",
         imageUrl: "",
         email: "ahmed@example.com",
         role: "editor",
         joinedAt: "2026-01-05",
      },
      {
         id: "76b34f91-e969-4b9b-9f83-003f49ad4ced",
         boardId: demoBoardId,
         userId: "demo-sara",
         displayName: "Sara Mohamed",
         imageUrl: "",
         email: "sara@example.com",
         role: "viewer",
         joinedAt: "2026-01-08",
      },
      {
         id: "86b34f91-e969-4b9b-9f83-003f49ad4ced",
         boardId: demoBoardId,
         userId: "demo-mohamed",
         displayName: "Mohamed Ali",
         imageUrl: "",
         email: "mohamed@example.com",
         role: "editor",
         joinedAt: "2026-01-12",
      },
   ],

   boards: [
      {
         id: demoBoardId,
         title: "Syncro - Development Workspace",
         createdAt: "2026-01-01",
      },
   ],

   tasks: [
      {
         id: "task-1",
         title: "Design authentication flow",
         description:
            "Set up Clerk authentication with sign-in, sign-up, and session handling.",
         priority: "high",
         status: "done",
         createdAt: "2026-06-20",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-hussien",
      },
      {
         id: "task-2",
         title: "Build board and task management",
         description:
            "Implement CRUD operations for boards and tasks using the application state layer.",
         priority: "high",
         status: "in-progress",
         createdAt: "2026-06-21",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-hussien",
      },
      {
         id: "task-3",
         title: "Implement search and filtering",
         description:
            "Add task search, priority filtering, and sorting functionality.",
         priority: "medium",
         status: "todo",
         createdAt: "2026-06-21",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-ahmed",
      },
      {
         id: "task-4",
         title: "Improve drag and drop experience",
         description:
            "Allow users to move tasks between Todo, In Progress, and Done columns.",
         priority: "medium",
         status: "todo",
         createdAt: "2026-06-22",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-mohamed",
      },
      {
         id: "task-5",
         title: "Integrate Supabase database",
         description:
            "Connect boards, tasks, and members to persistent PostgreSQL storage.",
         priority: "high",
         status: "in-progress",
         createdAt: "2026-06-23",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-hussien",
      },
      {
         id: "task-6",
         title: "Implement realtime synchronization",
         description:
            "Synchronize task changes between collaborators using Supabase Realtime.",
         priority: "high",
         status: "done",
         createdAt: "2026-06-24",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-ahmed",
      },
      {
         id: "task-7",
         title: "Build activity timeline",
         description:
            "Track important board, task, and member actions with readable snapshots.",
         priority: "medium",
         status: "done",
         createdAt: "2026-06-25",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-hussien",
      },
      {
         id: "task-8",
         title: "Implement role-based permissions",
         description:
            "Restrict board and member management actions according to user roles.",
         priority: "high",
         status: "in-progress",
         createdAt: "2026-06-26",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-hussien",
      },
      {
         id: "task-9",
         title: "Build member invitation flow",
         description:
            "Allow board owners to invite registered users and assign their roles.",
         priority: "medium",
         status: "done",
         createdAt: "2026-06-27",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-hussien",
      },
      {
         id: "task-10",
         title: "Improve mobile responsiveness",
         description:
            "Refine layouts and interactions for smaller screens and mobile devices.",
         priority: "medium",
         status: "todo",
         createdAt: "2026-06-28",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-mohamed",
      },
      {
         id: "task-11",
         title: "Implement notifications",
         description:
            "Create persistent notifications for important collaborative events.",
         priority: "low",
         status: "done",
         createdAt: "2026-06-29",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-ahmed",
      },
      {
         id: "task-12",
         title: "Prepare production documentation",
         description:
            "Document architecture, setup, environment variables, and deployment.",
         priority: "low",
         status: "todo",
         createdAt: "2026-06-30",
         dueDate: null,
         boardId: demoBoardId,
         assigneeId: "demo-hussien",
      },
   ],

   activities: [
      {
         id: "activity-1",
         boardId: demoBoardId,
         actorId: "demo-hussien",
         action: "board.created",
         entityType: "board",
         entityId: demoBoardId,
         metadata: {
            snapshot: {
               actor: {
                  display: "Hussien Walid",
               },
               entity: {
                  display: "Syncro - Development Workspace",
               },
            },
            details: {},
         },
         createdAt: "2026-01-01T10:00:00.000Z",
      },

      {
         id: "activity-2",
         boardId: demoBoardId,
         actorId: "demo-hussien",
         action: "member.invited",
         entityType: "member",
         entityId: "66b34f91-e969-4b9b-9f83-003f49ad4ced",
         metadata: {
            snapshot: {
               actor: {
                  display: "Hussien Walid",
               },
               entity: {
                  display: "Ahmed Hassan",
               },
            },
            details: {
               role: "editor",
            },
         },
         createdAt: "2026-06-28T09:30:00.000Z",
      },

      {
         id: "activity-3",
         boardId: demoBoardId,
         actorId: "demo-hussien",
         action: "task.created",
         entityType: "task",
         entityId: "task-8",
         metadata: {
            snapshot: {
               actor: {
                  display: "Hussien Walid",
               },
               entity: {
                  display: "Implement role-based permissions",
               },
            },
            details: {
               priority: "high",
            },
         },
         createdAt: "2026-06-28T11:15:00.000Z",
      },

      {
         id: "activity-4",
         boardId: demoBoardId,
         actorId: "demo-ahmed",
         action: "task.moved",
         entityType: "task",
         entityId: "task-6",
         metadata: {
            snapshot: {
               actor: {
                  display: "Ahmed Hassan",
               },
               entity: {
                  display: "Implement realtime synchronization",
               },
            },
            details: {
               from: "in-progress",
               to: "done",
            },
         },
         createdAt: "2026-06-29T08:45:00.000Z",
      },

      {
         id: "activity-5",
         boardId: demoBoardId,
         actorId: "demo-mohamed",
         action: "task.updated",
         entityType: "task",
         entityId: "task-4",
         metadata: {
            snapshot: {
               actor: {
                  display: "Mohamed Ali",
               },
               entity: {
                  display: "Improve drag and drop experience",
               },
            },
            details: {
               field: "description",
            },
         },
         createdAt: "2026-06-29T12:20:00.000Z",
      },

      {
         id: "activity-6",
         boardId: demoBoardId,
         actorId: "demo-hussien",
         action: "member.role_changed",
         entityType: "member",
         entityId: "76b34f91-e969-4b9b-9f83-003f49ad4ced",
         metadata: {
            snapshot: {
               actor: {
                  display: "Hussien Walid",
               },
               entity: {
                  display: "Sara Mohamed",
               },
            },
            details: {
               oldRole: "editor",
               newRole: "viewer",
            },
         },
         createdAt: "2026-06-30T10:10:00.000Z",
      },

      {
         id: "activity-7",
         boardId: demoBoardId,
         actorId: "demo-hussien",
         action: "task.assigned",
         entityType: "task",
         entityId: "task-3",
         metadata: {
            snapshot: {
               actor: {
                  display: "Hussien Walid",
               },
               entity: {
                  display: "Implement search and filtering",
               },
            },
            details: {
               assignee: "Ahmed Hassan",
            },
         },
         createdAt: "2026-06-30T13:40:00.000Z",
      },
   ],

   notifications: [
      {
         id: "notification-1",
         userId: "demo-hussien",
         boardId: demoBoardId,
         type: "task.assigned",
         metadata: {
            snapshot: {
               actor: {
                  display: "Hussien Walid",
               },
               board: {
                  display: "Syncro - Development Workspace",
               },
               task: {
                  display: "Build board and task management",
               },
            },
            details: {},
         },
         isRead: false,
         createdAt: "2026-06-29T09:15:00.000Z",
      },

      {
         id: "notification-2",
         userId: "demo-hussien",
         boardId: demoBoardId,
         type: "member.invited",
         metadata: {
            snapshot: {
               actor: {
                  display: "Hussien Walid",
               },
               board: {
                  display: "Syncro - Development Workspace",
               },
            },
            details: {},
         },
         isRead: false,
         createdAt: "2026-06-28T09:30:00.000Z",
      },

      {
         id: "notification-3",
         userId: "demo-hussien",
         boardId: demoBoardId,
         type: "task.assigned",
         metadata: {
            snapshot: {
               actor: {
                  display: "Ahmed Hassan",
               },
               board: {
                  display: "Syncro - Development Workspace",
               },
               task: {
                  display: "Implement realtime synchronization",
               },
            },
            details: {},
         },
         isRead: true,
         createdAt: "2026-06-29T08:45:00.000Z",
      },

      {
         id: "notification-4",
         userId: "demo-hussien",
         boardId: demoBoardId,
         type: "member.role_changed",
         metadata: {
            snapshot: {
               actor: {
                  display: "Hussien Walid",
               },
               board: {
                  display: "Syncro - Development Workspace",
               },
               role: "viewer",
            },
            details: {},
         },
         isRead: true,
         createdAt: "2026-06-30T10:10:00.000Z",
      },
   ],
};

export { defaultState, demoState };