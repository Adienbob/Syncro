
const demoBoardId = "56c34f91-e969-4b9b-9f83-003f49ad4ced";

const mockState = {
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
   ],
};

export { mockState };