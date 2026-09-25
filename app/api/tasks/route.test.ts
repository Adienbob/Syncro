import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   createSupabaseServerClient: vi.fn(),
   createActivity: vi.fn(),
   from: vi.fn(),
   select: vi.fn(),
   insert: vi.fn(),
   single: vi.fn(),
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
      TASK_CREATED: "task.created",
   },
}));

describe("API /api/tasks", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
         insert: mocks.insert,
      });

      mocks.insert.mockReturnValue({
         select: mocks.select,
      });

      mocks.select.mockReturnValue({
         single: mocks.single,
      });
   });

   it("returns tasks successfully", async () => {
      
      const { GET } = await import("./route");

      const tasks = [
         {
            id: "task-1",
            title: "Test task",
            board_id: "board-1",
            status: "todo",
         },
         {
            id: "task-2",
            title: "Another task",
            board_id: "board-1",
            status: "done",
         },
      ];

      mocks.select.mockResolvedValue({
         data: tasks,
         error: null,
      });

      const response = await GET();

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual(tasks);

      expect(mocks.from).toHaveBeenCalledWith("tasks");
      expect(mocks.select).toHaveBeenCalledWith("*");
   });

   it("returns 500 when loading tasks fails", async () => {
      const { GET } = await import("./route");

      mocks.select.mockResolvedValue({
         data: null,
         error: {
            message: "Failed to load tasks",
         },
      });

      const response = await GET();

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Failed to load tasks",
      });
   });

   it("returns 401 when creating a task while unauthenticated", async () => {
      const { POST } = await import("./route");
      mocks.currentUser.mockResolvedValue(null);

      const req = new Request("http://localhost/api/tasks", {
         method: "POST",
         body: JSON.stringify({
            title: "Test task",
            description: "Test description",
            priority: "high",
            dueDate: null,
            boardId: "board-1",
         }),
      });

      const response = await POST(req);

      expect(response.status).toBe(401);

      expect(await response.json()).toEqual({
         error: "Unauthorized",
      });

      expect(mocks.createSupabaseServerClient).not.toHaveBeenCalled();
   });

   it("creates a task successfully", async () => {
      const { POST } = await import("./route");

      const user = {
         id: "user-1",
         fullName: "Hussien Walid",
         username: "hussien",
         emailAddresses: [
            {
               emailAddress: "hussien@example.com",
            },
         ],
      };

      const createdTask = {
         id: "task-1",
         title: "Test task",
         description: "Test description",
         priority: "high",
         due_date: "2026-09-30",
         board_id: "board-1",
      };

      mocks.currentUser.mockResolvedValue(user);

      mocks.insert.mockReturnValue({
         select: mocks.select,
      });

      mocks.select.mockReturnValue({
         single: mocks.single,
      });

      mocks.single.mockResolvedValue({
         data: createdTask,
         error: null,
      });

      const req = new Request("http://localhost/api/tasks", {
         method: "POST",
         body: JSON.stringify({
            title: "Test task",
            description: "Test description",
            priority: "high",
            dueDate: "2026-09-30",
            boardId: "board-1",
         }),
      });

      const response = await POST(req);

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual(createdTask);

      expect(mocks.from).toHaveBeenCalledWith("tasks");

      expect(mocks.insert).toHaveBeenCalledWith([
         {
            title: "Test task",
            description: "Test description",
            priority: "high",
            due_date: "2026-09-30",
            board_id: "board-1",
         },
      ]);

      expect(mocks.createActivity).toHaveBeenCalledWith(
         expect.objectContaining({
            boardId: "board-1",
            actorId: "user-1",
            action: "task.created",
            entityType: "task",
            entityId: "task-1",
         })
      );
   });
});