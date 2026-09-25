import { describe, expect, it, vi } from "vitest";



const mocks = vi.hoisted(() => {
   const channel = {
      on: vi.fn(),
      subscribe: vi.fn(),
   };
   channel.on.mockReturnValue(channel);

   return {
      useAuth: vi.fn(),
      useUser: vi.fn(),
      dispatch: vi.fn(),
      channel,
      supabaseBrowser: {
         realtime: { setAuth: vi.fn() },
         getChannels: vi.fn(),
         channel: vi.fn(),
         removeChannel: vi.fn(),
      },
   };
});

mocks.useAuth.mockReturnValue({
   getToken: vi.fn(),
});

vi.mock("@clerk/nextjs", () => ({
   useAuth: mocks.useAuth,
   useUser: mocks.useUser,
}));

vi.mock("@/app/shared/services/supabase-browser", () => ({
   supabaseBrowser: mocks.supabaseBrowser,
}));

vi.mock("@/app/state/AppContext", () => ({
   useAppContext: () => ({
      dispatch: mocks.dispatch,
   }),
}));

describe("Test useTasksRealtime", () => {
   it("does not subscribe when the user is not signed in", async () => {
      const { renderHook } = await import("@testing-library/react");

      const { useTasksRealtime } = await import("./useTaskRealtime");

      mocks.useUser.mockReturnValue({
         user: null,
         isSignedIn: false,
      });

      renderHook(() => useTasksRealtime("board-1"));

      expect(
         mocks.supabaseBrowser.channel
      ).not.toHaveBeenCalled();
   });

   it("does not subscribe when the user is not signed in", async () => {
      const { renderHook } = await import("@testing-library/react");
      const { useTasksRealtime } = await import("./useTaskRealtime");

      mocks.useAuth.mockReturnValue({
         getToken: vi.fn(),
      });

      mocks.useUser.mockReturnValue({
         user: null,
         isSignedIn: false,
      });

      renderHook(() => useTasksRealtime("board-1"));

      expect(
         mocks.supabaseBrowser.channel
      ).not.toHaveBeenCalled();
   });

   it("subscribes to the task channel when the user is signed in", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useTasksRealtime } = await import("./useTaskRealtime");

      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      mocks.useAuth.mockReturnValue({
         getToken: mockGetToken,
      });

      mocks.useUser.mockReturnValue({
         user: {
            id: "demo-hussien",
         },
         isSignedIn: true,
      });

      mocks.supabaseBrowser.getChannels.mockReturnValue([]);
      mocks.supabaseBrowser.channel.mockReturnValue(mocks.channel);

      renderHook(() => useTasksRealtime("board-1"));

      await waitFor(() => {
         expect(
            mocks.supabaseBrowser.channel
         ).toHaveBeenCalledWith("tasks-board-1");
      });

      expect(
         mocks.supabaseBrowser.realtime.setAuth
      ).toHaveBeenCalledWith("test-token");

      expect(
         mocks.channel.subscribe
      ).toHaveBeenCalled();
   });

   it("dispatches ADD_TASK when a task is inserted", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useTasksRealtime } = await import("./useTaskRealtime");

      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      mocks.useAuth.mockReturnValue({
         getToken: mockGetToken,
      });

      mocks.useUser.mockReturnValue({
         user: {
            id: "demo-hussien",
         },
         isSignedIn: true,
      });

      mocks.supabaseBrowser.getChannels.mockReturnValue([]);
      mocks.supabaseBrowser.channel.mockReturnValue(mocks.channel);

      renderHook(() => useTasksRealtime("board-1"));

      await waitFor(() => {
         expect(mocks.channel.on).toHaveBeenCalled();
      });

      const callback = mocks.channel.on.mock.calls[0][2];

      const payload = {
         eventType: "INSERT",
         new: {
            id: "task-2",
            board_id: "board-1",
            title: "New task",
            description: "Test description",
            status: "todo",
            priority: "high",
            due_date: "2026-10-01",
            assignee_id: null,
            created_at: "2026-09-22",
         },
         old: {},
      };

      callback(payload);

      expect(mocks.dispatch).toHaveBeenCalledWith({
         type: "ADD_TASK",
         payload: {
            task: {
               id: "task-2",
               boardId: "board-1",
               title: "New task",
               description: "Test description",
               status: "todo",
               priority: "high",
               dueDate: "2026-10-01",
               assigneeId: null,
               createdAt: "2026-09-22",
            },
         },
      });
   });

   it("dispatches ADD_TASK when a task is inserted", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useTasksRealtime } = await import("./useTaskRealtime");

      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      mocks.useAuth.mockReturnValue({
         getToken: mockGetToken,
      });

      mocks.useUser.mockReturnValue({
         user: {
            id: "demo-hussien",
         },
         isSignedIn: true,
      });

      mocks.supabaseBrowser.getChannels.mockReturnValue([]);
      mocks.supabaseBrowser.channel.mockReturnValue(mocks.channel);
      mocks.channel.on.mockReturnValue(mocks.channel);
      mocks.channel.subscribe.mockReturnValue(mocks.channel);

      renderHook(() => useTasksRealtime("board-1"));

      await waitFor(() => {
         expect(mocks.channel.on).toHaveBeenCalled();
      });

      const callback = mocks.channel.on.mock.calls[0][2];

      callback({
         eventType: "INSERT",
         new: {
            id: "task-2",
            board_id: "board-1",
            title: "New task",
            description: "Test description",
            status: "todo",
            priority: "high",
            due_date: "2026-10-01",
            assignee_id: null,
            created_at: "2026-09-22",
         },
      });

      expect(mocks.dispatch).toHaveBeenCalledWith({
         type: "ADD_TASK",
         payload: {
            task: {
               id: "task-2",
               boardId: "board-1",
               title: "New task",
               description: "Test description",
               status: "todo",
               priority: "high",
               dueDate: "2026-10-01",
               assigneeId: null,
               createdAt: "2026-09-22",
            },
         },
      });
   });

   it("dispatches UPDATE_TASK when a task is updated", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useTasksRealtime } = await import("./useTaskRealtime");

      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      mocks.useAuth.mockReturnValue({
         getToken: mockGetToken,
      });

      mocks.useUser.mockReturnValue({
         user: {
            id: "demo-hussien",
         },
         isSignedIn: true,
      });

      mocks.supabaseBrowser.getChannels.mockReturnValue([]);
      mocks.supabaseBrowser.channel.mockReturnValue(mocks.channel);
      mocks.channel.on.mockReturnValue(mocks.channel);
      mocks.channel.subscribe.mockReturnValue(mocks.channel);

      renderHook(() => useTasksRealtime("board-1"));

      await waitFor(() => {
         expect(mocks.channel.on).toHaveBeenCalled();
      });

      const callback = mocks.channel.on.mock.calls[0][2];

      callback({
         eventType: "UPDATE",
         new: {
            id: "task-1",
            board_id: "board-1",
            title: "Updated task",
            description: "Updated description",
            status: "in-progress",
            priority: "high",
            due_date: "2026-10-15",
            assignee_id: "member-1",
            created_at: "2026-09-22",
         },
         old: {},
      });

      expect(mocks.dispatch).toHaveBeenCalledWith({
         type: "UPDATE_TASK",
         payload: {
            task: {
               id: "task-1",
               boardId: "board-1",
               title: "Updated task",
               description: "Updated description",
               status: "in-progress",
               priority: "high",
               dueDate: "2026-10-15",
               assigneeId: "member-1",
               createdAt: "2026-09-22",
            },
         },
      });
   });

   it("dispatches DELETE_TASK when a task is deleted", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useTasksRealtime } = await import("./useTaskRealtime");

      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      mocks.useAuth.mockReturnValue({
         getToken: mockGetToken,
      });

      mocks.useUser.mockReturnValue({
         user: {
            id: "demo-hussien",
         },
         isSignedIn: true,
      });

      mocks.supabaseBrowser.getChannels.mockReturnValue([]);
      mocks.supabaseBrowser.channel.mockReturnValue(mocks.channel);
      mocks.channel.on.mockReturnValue(mocks.channel);
      mocks.channel.subscribe.mockReturnValue(mocks.channel);

      renderHook(() => useTasksRealtime("board-1"));

      await waitFor(() => {
         expect(mocks.channel.on).toHaveBeenCalled();
      });

      const callback = mocks.channel.on.mock.calls[0][2];

      callback({
         eventType: "DELETE",
         new: {},
         old: {
            id: "task-1",
            board_id: "board-1",
            title: "Deleted task",
            description: "Task description",
            status: "done",
            priority: "high",
            due_date: null,
            assignee_id: null,
            created_at: "2026-09-22",
         },
      });

      expect(mocks.dispatch).toHaveBeenCalledWith({
         type: "DELETE_TASK",
         payload: {
            id: "task-1",
         },
      });
   });

   it("removes the channel when the hook unmounts", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useTasksRealtime } = await import("./useTaskRealtime");

      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      mocks.useAuth.mockReturnValue({
         getToken: mockGetToken,
      });

      mocks.useUser.mockReturnValue({
         user: {
            id: "demo-hussien",
         },
         isSignedIn: true,
      });

      mocks.supabaseBrowser.getChannels.mockReturnValue([]);
      mocks.supabaseBrowser.channel.mockReturnValue(mocks.channel);
      mocks.channel.on.mockReturnValue(mocks.channel);
      mocks.channel.subscribe.mockReturnValue(mocks.channel);

      const { unmount } = renderHook(() =>
         useTasksRealtime("board-1")
      );

      await waitFor(() => {
         expect(
            mocks.supabaseBrowser.channel
         ).toHaveBeenCalledWith("tasks-board-1");
      });

      unmount();

      expect(
         mocks.supabaseBrowser.removeChannel
      ).toHaveBeenCalledWith(mocks.channel);
   });
});