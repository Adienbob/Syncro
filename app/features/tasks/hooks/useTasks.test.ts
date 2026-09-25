import { describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();
const mockUseUser = vi.fn();

const mockRouter = {
   push: vi.fn(),
};

vi.stubGlobal("fetch", mockFetch);

vi.mock("@clerk/nextjs", () => ({
   useUser: () => mockUseUser(),
}));

vi.mock("next/navigation", () => ({
   useRouter: () => mockRouter,
}));

vi.mock("@/app/shared/utils/requireAuth", () => ({
   requireAuth: vi.fn(),
}));

vi.mock("@/app/shared/utils/getRole", () => ({
   getRole: vi.fn(),
}));

vi.mock("sonner", () => ({
   toast: {
      error: vi.fn(),
      success: vi.fn(),
   },
}));

vi.mock("@/app/state/AppContext", async () => {
   const mocks = await import("@/app/tests/mocks/appContext");

   return {
      useAppContext: () => ({
         state: mocks.mockState,
         dispatch: vi.fn(),
      }),
   };
});

describe("Test useTasks", () => {
   it("does not add a task when the user is a viewer", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("viewer");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useTasks } = await import("./useTasks");

      const { addTask } = useTasks("board-1");

      await addTask(
         "New task",
         "Task description",
         "medium",
         null,
         "board-1",
         null
      );

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("does not add a task when the user is a viewer", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("viewer");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useTasks } = await import("./useTasks");

      const { addTask } = useTasks("board-1");

      await addTask(
         "New task",
         "Task description",
         "medium",
         null,
         "board-1",
         null
      );

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("shows an error when adding a task fails", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: false,
         json: async () => ({}),
      });

      const { useTasks } = await import("./useTasks");

      const { addTask } = useTasks("board-1");

      await addTask(
         "New task",
         "Task description",
         "medium",
         null,
         "board-1",
         null
      );

      expect(toast.error).toHaveBeenCalledWith(
         "Failed to create task."
      );
   });

   it("does not delete a task when the user is a viewer", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("viewer");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useTasks } = await import("./useTasks");

      const { deleteTask } = useTasks("board-1");

      await deleteTask("task-1");

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("does not delete a task when the user is a viewer", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("viewer");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useTasks } = await import("./useTasks");

      const { deleteTask } = useTasks("board-1");

      await deleteTask("task-1");

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("deletes a task when the user has permission", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: true,
         json: async () => ({}),
      });

      const { useTasks } = await import("./useTasks");

      const { deleteTask } = useTasks("board-1");

      await deleteTask("task-1");

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/tasks/task-1",
         {
            method: "DELETE",
         }
      );
   });

   it("shows an error when deleting a task fails", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: false,
         json: async () => ({}),
      });

      const { useTasks } = await import("./useTasks");

      const { deleteTask } = useTasks("board-1");

      await deleteTask("task-1");

      expect(toast.error).toHaveBeenCalledWith(
         "Failed to delete task."
      );
   });

   it("does not edit a task when the user is a viewer", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("viewer");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useTasks } = await import("./useTasks");

      const { editTask } = useTasks("board-1");

      await editTask(
         "task-1",
         "Updated task",
         "Updated description",
         "high",
         "2026-10-01"
      );

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("edits a task when the user has permission", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: true,
         json: async () => ({}),
      });

      const { useTasks } = await import("./useTasks");

      const { editTask } = useTasks("board-1");

      await editTask(
         "task-1",
         "Updated task",
         "Updated description",
         "high",
         "2026-10-01"
      );

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/tasks/task-1",
         {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title: "Updated task",
               description: "Updated description",
               priority: "high",
               due_date: "2026-10-01",
            }),
         }
      );
   });

   it("does not move a task when the user is a viewer", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("viewer");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useTasks } = await import("./useTasks");

      const { moveTask } = useTasks("board-1");

      await moveTask("task-1", "in-progress");

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("moves a task when the user has permission", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: true,
         json: async () => ({}),
      });

      const { useTasks } = await import("./useTasks");

      const { moveTask } = useTasks("board-1");

      await moveTask("task-1", "in-progress");

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/tasks/task-1",
         {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               status: "in-progress",
            }),
         }
      );
   });

   it("shows an error when moving a task fails", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: false,
         json: async () => ({}),
      });

      const { useTasks } = await import("./useTasks");

      const { moveTask } = useTasks("board-1");

      await moveTask("task-1", "in-progress");

      expect(toast.error).toHaveBeenCalledWith(
         "Failed to move task."
      );
   });

   it("does not assign a task when the user is a viewer", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("viewer");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      const { useTasks } = await import("./useTasks");

      const { assignTask } = useTasks("board-1");

      await assignTask("task-1", "member-1");

      expect(mockFetch).not.toHaveBeenCalled();

      expect(toast.error).toHaveBeenCalledWith(
         "You don't have permission"
      );
   });

   it("assigns a task when the user has permission", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: true,
         json: async () => ({}),
      });

      const { useTasks } = await import("./useTasks");

      const { assignTask } = useTasks("board-1");

      await assignTask("task-1", "member-1");

      expect(mockFetch).toHaveBeenCalledWith(
         "/api/tasks/task-1/assignee",
         {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               assigneeId: "member-1",
            }),
         }
      );
   });

   it("shows an error when assigning a task fails", async () => {
      const { requireAuth } = await import(
         "@/app/shared/utils/requireAuth"
      );

      const { getRole } = await import(
         "@/app/shared/utils/getRole"
      );

      const { toast } = await import("sonner");

      vi.mocked(requireAuth).mockReturnValue(true);
      vi.mocked(getRole).mockReturnValue("editor");

      mockUseUser.mockReturnValue({
         isSignedIn: true,
         user: {
            id: "demo-hussien",
         },
      });

      mockFetch.mockResolvedValue({
         ok: false,
         json: async () => ({}),
      });

      const { useTasks } = await import("./useTasks");

      const { assignTask } = useTasks("board-1");

      await assignTask("task-1", "member-1");

      expect(toast.error).toHaveBeenCalledWith(
         "Failed to assign task."
      );
   });
});