import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   createSupabaseServerClient: vi.fn(),
   createActivity: vi.fn(),
   from: vi.fn(),
   select: vi.fn(),
   eq: vi.fn(),
   single: vi.fn(),
   delete: vi.fn(),
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

vi.mock("@/app/features/activity/constants", () => ({
   ActivityActions: {
      TASK_DELETED: "task.deleted",
      TASK_MOVED: "task.moved",
      TASK_UPDATED: "task.updated",
   },
}));

describe("API /api/tasks/[taskId]", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
         delete: mocks.delete,
         update: mocks.update,
      });

      mocks.select.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.delete.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.update.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.eq.mockReturnValue({
         single: mocks.single,
         select: mocks.select,
      });
   });

   it("returns 401 when the user is not authenticated", async () => {
   const { DELETE } = await import("./route");

   mocks.currentUser.mockResolvedValue(null);

   const req = new Request(
      "http://localhost/api/tasks/task-1",
      {
         method: "DELETE",
      }
   );

   const response = await DELETE(req, {
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

it("returns 500 when the task cannot be found", async () => {
   const { DELETE } = await import("./route");

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
      "http://localhost/api/tasks/task-1",
      {
         method: "DELETE",
      }
   );

   const response = await DELETE(req, {
      params: Promise.resolve({
         taskId: "task-1",
      }),
   });

   expect(response.status).toBe(500);

   expect(await response.json()).toEqual({
      error: "Task not found",
   });

   expect(mocks.delete).not.toHaveBeenCalled();
});

it("returns 500 when deleting the task fails", async () => {
   const { DELETE } = await import("./route");

   mocks.currentUser.mockResolvedValue({
      id: "user-1",
   });

   mocks.single.mockResolvedValue({
      data: {
         board_id: "board-1",
         title: "Test task",
      },
      error: null,
   });

   mocks.eq
      .mockReturnValueOnce({
         single: mocks.single,
      })
      .mockResolvedValueOnce({
         error: {
            message: "Failed to delete task",
         },
      });

   const req = new Request(
      "http://localhost/api/tasks/task-1",
      {
         method: "DELETE",
      }
   );

   const response = await DELETE(req, {
      params: Promise.resolve({
         taskId: "task-1",
      }),
   });

   expect(response.status).toBe(500);

   expect(await response.json()).toEqual({
      error: "Failed to delete task",
   });

   expect(mocks.createActivity).not.toHaveBeenCalled();
});

it("deletes the task successfully", async () => {
   const { DELETE } = await import("./route");

   mocks.currentUser.mockResolvedValue({
      id: "user-1",
      fullName: "Hussien",
      username: "hussien",
   });

   mocks.single.mockResolvedValue({
      data: {
         board_id: "board-1",
         title: "Test task",
      },
      error: null,
   });

   mocks.eq
      .mockReturnValueOnce({
         single: mocks.single,
      })
      .mockResolvedValueOnce({
         error: null,
      });

   mocks.createActivity.mockResolvedValue(undefined);

   const req = new Request(
      "http://localhost/api/tasks/task-1",
      {
         method: "DELETE",
      }
   );

   const response = await DELETE(req, {
      params: Promise.resolve({
         taskId: "task-1",
      }),
   });

   expect(response.status).toBe(200);

   expect(await response.json()).toEqual({
      success: true,
   });

   expect(mocks.delete).toHaveBeenCalled();
   expect(mocks.createActivity).toHaveBeenCalled();
});
});