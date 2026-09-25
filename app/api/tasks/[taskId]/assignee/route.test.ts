import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   createSupabaseServerClient: vi.fn(),
   createActivity: vi.fn(),
   createNotification: vi.fn(),

   from: vi.fn(),
   select: vi.fn(),
   eq: vi.fn(),
   single: vi.fn(),
   maybeSingle: vi.fn(),
   update: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
   currentUser: mocks.currentUser,
}));

vi.mock("@/app/shared/services/supabase", () => ({
   createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

vi.mock("@/app/features/activity/utils/createActivity", () => ({
   createActivity: mocks.createActivity,
}));

vi.mock("@/app/features/notifications/utils/createNotification", () => ({
   createNotification: mocks.createNotification,
}));

vi.mock("@/app/features/activity/constants", () => ({
   ActivityActions: {
      TASK_ASSIGNED: "task.assigned",
      TASK_UNASSIGNED: "task.unassigned",
      TASK_REASSIGNED: "task.reassigned",
   },
}));

vi.mock("@/app/features/notifications/constants", () => ({
   NotificationTypes: {
      TASK_ASSIGNED: "task.assigned",
   },
}));

describe("API /api/tasks/[taskId]/assignee", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
         update: mocks.update,
      });

      mocks.select.mockReturnValue({
         eq: mocks.eq,
         single: mocks.single,
      });

      mocks.update.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.eq.mockReturnValue({
         eq: mocks.eq,
         single: mocks.single,
         maybeSingle: mocks.maybeSingle,
         select: mocks.select,
      });
   });

   it("returns 401 when the user is not authenticated", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue(null);

      const req = new Request(
         "http://localhost/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            body: JSON.stringify({
               assigneeId: "user-2",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(401);

      expect(await response.json()).toEqual({
         error: "Unauthorized",
      });

      expect(mocks.createSupabaseServerClient).not.toHaveBeenCalled();
   });

   it("returns 404 when the task is not found", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.single.mockResolvedValue({
         data: null,
         error: {
            message: "Task not found",
         },
      });

      const req = new Request(
         "http://localhost/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            body: JSON.stringify({
               assigneeId: "user-2",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(404);

      expect(await response.json()).toEqual({
         error: "Task not found",
      });
   });

   it("returns 403 when the current user is a viewer", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.single
         .mockResolvedValueOnce({
            data: {
               id: "task-1",
               board_id: "board-1",
               title: "Test task",
               assignee_id: null,
            },
            error: null,
         })
         .mockResolvedValueOnce({
            data: {
               role: "viewer",
            },
            error: null,
         });

      const req = new Request(
         "http://localhost/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            body: JSON.stringify({
               assigneeId: "user-2",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(403);

      expect(await response.json()).toEqual({
         error: "Forbidden",
      });

      expect(mocks.update).not.toHaveBeenCalled();
   });

   it("returns the task without updating when the assignee is unchanged", async () => {
      const { PATCH } = await import("./route");

      const task = {
         id: "task-1",
         board_id: "board-1",
         title: "Test task",
         assignee_id: "user-2",
      };

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.single
         .mockResolvedValueOnce({
            data: task,
            error: null,
         })
         .mockResolvedValueOnce({
            data: {
               role: "editor",
            },
            error: null,
         });

      const req = new Request(
         "http://localhost/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            body: JSON.stringify({
               assigneeId: "user-2",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(task);

      expect(mocks.update).not.toHaveBeenCalled();
      expect(mocks.createActivity).not.toHaveBeenCalled();
      expect(mocks.createNotification).not.toHaveBeenCalled();
   });

   it("returns 400 when the assignee is not a board member", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.single
         .mockResolvedValueOnce({
            data: {
               id: "task-1",
               board_id: "board-1",
               title: "Test task",
               assignee_id: null,
            },
            error: null,
         })
         .mockResolvedValueOnce({
            data: {
               role: "editor",
            },
            error: null,
         })
         .mockResolvedValueOnce({
            data: {
               title: "Test Board",
            },
            error: null,
         });

      mocks.maybeSingle.mockResolvedValue({
         data: null,
      });

      const req = new Request(
         "http://localhost/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            body: JSON.stringify({
               assigneeId: "user-2",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(400);

      expect(await response.json()).toEqual({
         error: "Assignee is not a board member",
      });

      expect(mocks.update).not.toHaveBeenCalled();
   });

   it("returns 500 when updating the task assignee fails", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
      });

      mocks.single
         .mockResolvedValueOnce({
            data: { id: "task-1", board_id: "board-1", title: "Test task", assignee_id: null },
            error: null,
         })
         .mockResolvedValueOnce({ data: { role: "editor" }, error: null })
         .mockResolvedValueOnce({ data: { title: "Test Board" }, error: null })
         .mockResolvedValueOnce({
            data: null,
            error: { message: "Failed to update task" },
         });

      mocks.maybeSingle.mockResolvedValue({
         data: {
            id: "member-2",
            user_id: "user-2",
            display_name: "Ahmed",
            image_url: null,
            email: "ahmed@example.com",
            role: "viewer",
         },
      });

      const req = new Request("http://localhost/api/tasks/task-1/assignee", {
         method: "PATCH",
         body: JSON.stringify({ assigneeId: "user-2" }),
      });

      const response = await PATCH(req, { params: Promise.resolve({ taskId: "task-1" }) });

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "Failed to update task" });
      expect(mocks.createActivity).not.toHaveBeenCalled();
      expect(mocks.createNotification).not.toHaveBeenCalled();
   });

   it("assigns the task successfully", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
      });

      const task = {
         id: "task-1",
         board_id: "board-1",
         title: "Test task",
         assignee_id: null,
      };

      const updatedTask = {
         ...task,
         assignee_id: "user-2",
      };

      mocks.single
         .mockResolvedValueOnce({
            data: task,
            error: null,
         })
         .mockResolvedValueOnce({
            data: { role: "editor" },
            error: null,
         })
         .mockResolvedValueOnce({
            data: { title: "Test Board" },
            error: null,
         })
         .mockResolvedValueOnce({
            data: updatedTask,
            error: null,
         });

      mocks.maybeSingle.mockResolvedValue({
         data: {
            id: "member-2",
            user_id: "user-2",
            display_name: "Ahmed",
            image_url: null,
            email: "ahmed@example.com",
            role: "viewer",
         },
      });

      mocks.createActivity.mockResolvedValue(undefined);
      mocks.createNotification.mockResolvedValue(undefined);

      const req = new Request(
         "http://localhost/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            body: JSON.stringify({
               assigneeId: "user-2",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(updatedTask);

      expect(mocks.update).toHaveBeenCalledWith({
         assignee_id: "user-2",
      });

      expect(mocks.createActivity).toHaveBeenCalledWith(
         expect.objectContaining({
            action: "task.assigned",
            entityType: "task",
            entityId: "task-1",
         })
      );

      expect(mocks.createNotification).toHaveBeenCalledWith(
         expect.objectContaining({
            userId: "user-2",
            boardId: "board-1",
            type: "task.assigned",
         })
      );
   });

   it("unassigns the task successfully", async () => {
      const { PATCH } = await import("./route");
      const task = {
         id: "task-1",
         board_id: "board-1",
         title: "Test task",
         assignee_id: "user-2",
      };

      const updatedTask = {
         ...task,
         assignee_id: null,
      };

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
         emailAddresses: [
            { emailAddress: "hussien@example.com" },
         ],
      });

      const taskQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const memberQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const boardQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const updateQuery = {
         eq: vi.fn(),
         select: vi.fn(),
         single: vi.fn(),
      };

      taskQuery.eq.mockReturnValue(taskQuery);
      taskQuery.single.mockResolvedValue({
         data: task,
         error: null,
      });

      memberQuery.eq.mockReturnValue(memberQuery);
      memberQuery.single.mockResolvedValue({
         data: {
            role: "editor",
         },
         error: null,
      });

      boardQuery.eq.mockReturnValue(boardQuery);
      boardQuery.single.mockResolvedValue({
         data: {
            title: "Test Board",
         },
         error: null,
      });

      updateQuery.eq.mockReturnValue(updateQuery);
      updateQuery.select.mockReturnValue(updateQuery);
      updateQuery.single.mockResolvedValue({
         data: updatedTask,
         error: null,
      });

      mocks.from
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(taskQuery),
         })
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(memberQuery),
         })
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(boardQuery),
         })
         .mockReturnValueOnce({
            update: vi.fn().mockReturnValue(updateQuery),
         });

      const req = new Request("http://localhost/api/tasks/task-1/assignee", {
         method: "PATCH",
         body: JSON.stringify({
            assigneeId: null,
         }),
      });

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(updatedTask);

      expect(mocks.createActivity).toHaveBeenCalledWith(
         expect.objectContaining({
            action: "task.unassigned",
            entityType: "task",
            entityId: task.id,
         })
      );

      expect(mocks.createNotification).not.toHaveBeenCalled();
   });

   it("reassigns the task successfully", async () => {
      const { PATCH } = await import("./route");
      const task = {
         id: "task-1",
         board_id: "board-1",
         title: "Test task",
         assignee_id: "user-2",
      };

      const updatedTask = {
         ...task,
         assignee_id: "user-3",
      };

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
         emailAddresses: [
            { emailAddress: "hussien@example.com" },
         ],
      });

      const taskQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const memberQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const boardQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const assigneeQuery = {
         eq: vi.fn(),
         maybeSingle: vi.fn(),
      };

      const updateQuery = {
         eq: vi.fn(),
         select: vi.fn(),
         single: vi.fn(),
      };

      taskQuery.eq.mockReturnValue(taskQuery);
      taskQuery.single.mockResolvedValue({
         data: task,
         error: null,
      });

      memberQuery.eq.mockReturnValue(memberQuery);
      memberQuery.single.mockResolvedValue({
         data: {
            role: "editor",
         },
         error: null,
      });

      boardQuery.eq.mockReturnValue(boardQuery);
      boardQuery.single.mockResolvedValue({
         data: {
            title: "Test Board",
         },
         error: null,
      });

      assigneeQuery.eq.mockReturnValue(assigneeQuery);
      assigneeQuery.maybeSingle.mockResolvedValue({
         data: {
            id: "member-3",
            user_id: "user-3",
            display_name: "Ahmed",
            image_url: null,
            email: "ahmed@example.com",
            role: "viewer",
         },
         error: null,
      });

      updateQuery.eq.mockReturnValue(updateQuery);
      updateQuery.select.mockReturnValue(updateQuery);
      updateQuery.single.mockResolvedValue({
         data: updatedTask,
         error: null,
      });

      mocks.from
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(taskQuery),
         })
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(memberQuery),
         })
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(boardQuery),
         })
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(assigneeQuery),
         })
         .mockReturnValueOnce({
            update: vi.fn().mockReturnValue(updateQuery),
         });

      const req = new Request(
         "http://localhost/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            body: JSON.stringify({
               assigneeId: "user-3",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(updatedTask);

      expect(mocks.createActivity).toHaveBeenCalledWith(
         expect.objectContaining({
            action: "task.reassigned",
            entityType: "task",
            entityId: task.id,
            metadata: expect.objectContaining({
               details: expect.objectContaining({
                  previousAssignee: "user-2",
                  newAssignee: "Ahmed",
               }),
            }),
         })
      );

      expect(mocks.createNotification).toHaveBeenCalledWith(
         expect.objectContaining({
            userId: "user-3",
            boardId: "board-1",
            type: "task.assigned",
         })
      );
   });

   it("returns 200 when activity creation fails", async () => {
      const { PATCH } = await import("./route");
      const task = {
         id: "task-1",
         board_id: "board-1",
         title: "Test task",
         assignee_id: null,
      };

      const updatedTask = {
         ...task,
         assignee_id: "user-2",
      };

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
         emailAddresses: [
            { emailAddress: "hussien@example.com" },
         ],
      });

      mocks.createActivity.mockRejectedValue(
         new Error("Activity failed")
      );

      const taskQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const memberQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const boardQuery = {
         eq: vi.fn(),
         single: vi.fn(),
      };

      const assigneeQuery = {
         eq: vi.fn(),
         maybeSingle: vi.fn(),
      };

      const updateQuery = {
         eq: vi.fn(),
         select: vi.fn(),
         single: vi.fn(),
      };

      taskQuery.eq.mockReturnValue(taskQuery);
      taskQuery.single.mockResolvedValue({
         data: task,
         error: null,
      });

      memberQuery.eq.mockReturnValue(memberQuery);
      memberQuery.single.mockResolvedValue({
         data: {
            role: "editor",
         },
         error: null,
      });

      boardQuery.eq.mockReturnValue(boardQuery);
      boardQuery.single.mockResolvedValue({
         data: {
            title: "Test Board",
         },
         error: null,
      });

      assigneeQuery.eq.mockReturnValue(assigneeQuery);
      assigneeQuery.maybeSingle.mockResolvedValue({
         data: {
            id: "member-2",
            user_id: "user-2",
            display_name: "Ahmed",
            image_url: null,
            email: "ahmed@example.com",
            role: "viewer",
         },
         error: null,
      });

      updateQuery.eq.mockReturnValue(updateQuery);
      updateQuery.select.mockReturnValue(updateQuery);
      updateQuery.single.mockResolvedValue({
         data: updatedTask,
         error: null,
      });

      mocks.from
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(taskQuery),
         })
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(memberQuery),
         })
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(boardQuery),
         })
         .mockReturnValueOnce({
            select: vi.fn().mockReturnValue(assigneeQuery),
         })
         .mockReturnValueOnce({
            update: vi.fn().mockReturnValue(updateQuery),
         });

      const req = new Request(
         "http://localhost/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            body: JSON.stringify({
               assigneeId: "user-2",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            taskId: "task-1",
         }),
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(updatedTask);

      expect(mocks.createActivity).toHaveBeenCalled();

      expect(mocks.createNotification).toHaveBeenCalled();
   });
});