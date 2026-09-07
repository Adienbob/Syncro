import { demoState, demoBoardId } from "./initialState";
import { describe, expect, it } from "vitest";
import { reducer } from "./reducer";
import { ActivityLog, AppNotification } from "../types/models";


describe("testing reducer", () => {

   describe("testing notifications", () => {

      it("sets the notifications", () => {
         const notifications: AppNotification[] = [{id: "notification-1",
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
      }]

         const newState = reducer(demoState, {
            type: "SET_NOTIFICATIONS",
            payload: {
               notifications: notifications
            }
         })

         expect(newState.notifications).toEqual(notifications)
      })

      it("adds a new notification", () => {
         const newState = reducer(demoState, {
            type: "ADD_NOTIFICATION",
            payload: {
               notification: {
                  id: "notification-5",
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
                           display: "Testing Syncro",
                        },
                     },
                     details: {},
                  },
                  isRead: false,
                  createdAt: "2026-06-29T09:15:00.000Z",
               }
            }
         })

         expect(newState.notifications.length).toBe(
            demoState.notifications.length + 1
         )

         expect(newState.notifications).toContainEqual({
            id: "notification-5",
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
                     display: "Testing Syncro",
                  },
               },
               details: {},
            },
            isRead: false,
            createdAt: "2026-06-29T09:15:00.000Z",
         })
      })

      it("marks the specified notification as read", () => {
         const notificationId = "notification-1";

         const newState = reducer(demoState, {
            type: "MARK_NOTIFICATION_READ",
            payload: {
               id: notificationId,
            },
         });

         expect(
            newState.notifications.find(
               (notification) => notification.id === notificationId
            )?.isRead
         ).toBe(true);
      });

      it("marks all notifications as read", () => {
         const newState = reducer(demoState, {
            type: "MARK_ALL_NOTIFICATIONS_READ",
         });

         expect(
            newState.notifications.every(
               (notification) => notification.isRead === true
            )
         ).toBe(true);
      });
   })

   describe("testing activities", () => {
      it("sets the activities", () => {
         const activities: ActivityLog[] = [{
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
            createdAt: "2026-06-29T12:20:00.000Z"
         }];

         const newState = reducer(demoState, {
            type: "SET_ACTIVITIES",
            payload: {
               activities,
            },
         });

         expect(newState.activities).toEqual(activities);
      });

      it("adds a new activity", () => {
         const activity: ActivityLog = {
            id: "activity-11",
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
            createdAt: "2026-06-29T12:20:00.000Z"
         };

         const newState = reducer(demoState, {
            type: "ADD_ACTIVITY",
            payload: {
               activity: activity,
            },
         });

         expect(newState.activities.length).toBe(
            demoState.activities.length + 1
         );

         expect(newState.activities).toContainEqual(activity);
      });

      it("does not add a duplicate activity", () => {
         const activity: ActivityLog = {
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
            createdAt: "2026-06-29T12:20:00.000Z"
         };

         const newState = reducer(demoState, {
            type: "ADD_ACTIVITY",
            payload: {
               activity: activity,
            },
         });

         expect(newState.activities.length).toBe(
            demoState.activities.length
         );

         expect(newState).toBe(demoState);
      });
   })


   describe("testing members CRUD", () => {
      
      it("sets the board members", () => {
         const newState = reducer(demoState, {
            type: "SET_MEMBERS",
            payload: {
               members: [{
                  id: "56b34f91-e969-4b9b-9f83-004f49ad4ced",
                  boardId: demoBoardId,
                  userId: "demo-hussien",
                  displayName: "Hussien Walid",
                  imageUrl: "",
                  email: "hussienwalid125@gmail.com",
                  role: "editor",
                  joinedAt: "2026-01-01",
               }]
            }
         })

         expect(newState.members.length).toBe(1)

         expect(newState.members).toContainEqual({
            id: "56b34f91-e969-4b9b-9f83-004f49ad4ced",
            boardId: demoBoardId,
            userId: "demo-hussien",
            displayName: "Hussien Walid",
            imageUrl: "",
            email: "hussienwalid125@gmail.com",
            role: "editor",
            joinedAt: "2026-01-01",
         })
      })

      it("adds a new member", () => {
         const newState = reducer(demoState, {
            type: "ADD_MEMBER",
            payload: {
               member: {
                  id: "new-member-1",
                  boardId: demoBoardId,
                  userId: "demo-ahmed",
                  displayName: "Ahmed Hassan",
                  imageUrl: "",
                  email: "ahmed@example.com",
                  role: "viewer",
                  joinedAt: "2026-09-07",
               }
            }
         })

         expect(newState.members.length).toBe(demoState.members.length + 1)

         expect(newState.members).toContainEqual({
            id: "new-member-1",
            boardId: demoBoardId,
            userId: "demo-ahmed",
            displayName: "Ahmed Hassan",
            imageUrl: "",
            email: "ahmed@example.com",
            role: "viewer",
            joinedAt: "2026-09-07",
         })
      })

      it("updates the specified member role", () => {
         const role = "editor"
         const memberId = "66b34f91-e969-4b9b-9f83-003f49ad4ced"

         const newState = reducer(demoState, {
            type: "UPDATE_MEMBER",
            payload: {
               id: memberId,
               role: role
            }
         });

         expect(newState.members.find((member) => member.id === memberId)).toEqual(expect.objectContaining({
            role: role
         }))
      })

      it("removes the specified member", () => {
         const memberId = "56b34f91-e969-4b9b-9f83-003f49ad4ced";

         const newState = reducer(demoState, {
            type: "REMOVE_MEMBER",
            payload: {
               id: memberId,
            }
         });

         expect(newState.members.length).toBe(demoState.members.length - 1);

         expect(
            newState.members.some((member) => member.id === memberId)
         ).toBe(false);
      })
   })

   describe("testing boards CRUD", () => {

      describe("testing ADD_BOARD", () => {
         it("adds a new board and preserves existing boards", () => {

            const newState = reducer(demoState, {
               type: "ADD_BOARD",
               payload: {
                  id: "new-board-id",
                  title: "New Board",
                  userId: "user-1",
                  createdAt: "2026-09-06",
               }
            })

            expect(newState.boards.length).toBe(demoState.boards.length + 1)

            expect(newState.boards).toContainEqual({
               id: "new-board-id",
               title: "New Board",
               createdAt: "2026-09-06",
            })

         })
      })

      describe("testing RENAME_BOARD", () => {
         it("renames the specified board", () => {

            const newState = reducer(demoState, {
               type: "RENAME_BOARD",
               payload: {
                  id: demoBoardId,
                  title: "newTitle"
               }
            })

            expect(newState.boards.some((board) => board.title === "newTitle" && board.id === demoBoardId)).toBe(true)
         })
      })

      describe("testing DELETE_BOARD", () => {
         
         it("deletes the specified board", () => {

            const newState = reducer(demoState, {
               type: "DELETE_BOARD",
               payload: {
                  id: demoBoardId,
               }
            })

            expect(newState.boards.length).toBe(demoState.boards.length - 1)

            expect(newState.boards.some((board) => board.id === demoBoardId)).toBe(false)

         })
      })

   })


   describe("testing task CRUD", () => {

      it("adds a new task to the specified board", () => {
         const newState = reducer(demoState, {
            type: "ADD_TASK",
            payload: {
               task: {
                  id: "new-task-1",
                  title: "New Task",
                  createdAt: "2026-09-06",
                  description: "Created new task",
                  priority: "high",
                  dueDate: null,
                  status: "todo",
                  boardId: demoBoardId,
                  assigneeId: null
               }
            }
         })

         expect(newState.tasks.length).toBe(demoState.tasks.length + 1)

         expect(newState.tasks).toContainEqual({
            id: "new-task-1",
            title: "New Task",
            createdAt: "2026-09-06",
            description: "Created new task",
            priority: "high",
            dueDate: null,
            status: "todo",
            boardId: demoBoardId,
            assigneeId: null
         })
      })

      it("edits the specified task", () => {
         const taskId = "task-1";
         const newState = reducer(demoState, {
            type: "UPDATE_TASK",
            payload: {
               task: {
                  id: "task-1",
                  title: "Design authentication flow (editing task)",
                  description:
                     "Set up Clerk authentication with sign-in, sign-up, and session handling.",
                  priority: "high",
                  status: "done",
                  createdAt: "2026-06-20",
                  dueDate: null,
                  boardId: demoBoardId,
                  assigneeId: "demo-hussien",
               }
            }
         })


         expect(newState.tasks.find((task) => task.id === taskId)).toEqual({
            id: "task-1",
            title: "Design authentication flow (editing task)",
            description:
               "Set up Clerk authentication with sign-in, sign-up, and session handling.",
            priority: "high",
            status: "done",
            createdAt: "2026-06-20",
            dueDate: null,
            boardId: demoBoardId,
            assigneeId: "demo-hussien",
         })
      })

      it("deletes the specified task", () => {
         const taskId = "task-1"
         const newState = reducer(demoState, {
            type: "DELETE_TASK",
            payload: {
               id: taskId,
            }
         })

         expect(newState.tasks.length).toBe(demoState.tasks.length - 1)

         expect(newState.tasks.some((task) => task.id === taskId)).toBe(false)

      })
   })


})