import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   getToken: vi.fn(),
   dispatch: vi.fn(),

   channel: {
      on: vi.fn(),
      subscribe: vi.fn(),
   },

   supabaseBrowser: {
      realtime: {
         setAuth: vi.fn(),
      },
      channel: vi.fn(),
      removeChannel: vi.fn(),
   },
}));

vi.mock("@clerk/nextjs", () => ({
   useAuth: () => ({
      getToken: mocks.getToken,
   }),
}));

vi.mock("@/app/shared/services/supabase-browser", () => ({
   supabaseBrowser: mocks.supabaseBrowser,
}));

vi.mock("@/app/state/AppContext", () => ({
   useAppContext: () => ({
      state: {
         activities: [],
      },
      dispatch: mocks.dispatch,
   }),
}));

describe("Test useActivity", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.supabaseBrowser.channel.mockReturnValue(
         mocks.channel
      );

      mocks.channel.on.mockReturnValue(
         mocks.channel
      );

      mocks.channel.subscribe.mockReturnValue(
         mocks.channel
      );
   });

   it("loads activities and dispatches SET_ACTIVITIES", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useActivity } = await import("./useActivity");

      mocks.getToken.mockResolvedValue("test-token");

      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [
               {
                  id: "activity-1",
                  board_id: "board-1",
                  actor_id: "user-1",
                  action: "task.created",
                  entity_type: "task",
                  entity_id: "task-1",
                  metadata: {},
                  created_at: "2026-09-25",
               },
            ],
         })
      );

      renderHook(() => useActivity("board-1"));

      await waitFor(() => {
         expect(mocks.dispatch).toHaveBeenCalledWith({
            type: "SET_ACTIVITIES",
            payload: {
               activities: [
                  {
                     id: "activity-1",
                     board_id: "board-1",
                     actor_id: "user-1",
                     action: "task.created",
                     entity_type: "task",
                     entity_id: "task-1",
                     metadata: {},
                     created_at: "2026-09-25",
                     createdAt: "2026-09-25",
                     boardId: "board-1",
                     actorId: "user-1",
                     entityType: "task",
                     entityId: "task-1",
                  },
               ],
            },
         });
      });

      expect(fetch).toHaveBeenCalledWith(
         "/api/boards/board-1/activity"
      );
   });

   it("sets an error when loading activities fails", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useActivity } = await import("./useActivity");

      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue({
            ok: false,
         })
      );

      const { result } = renderHook(() => useActivity("board-1"));

      await waitFor(() => {
         expect(result.current.error).toBe(
            "Failed to load activities."
         );
      });

      expect(result.current.loading).toBe(false);
      expect(mocks.dispatch).not.toHaveBeenCalled();
   });

   it("dispatches ADD_ACTIVITY when a new activity is inserted", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useActivity } = await import("./useActivity");

      mocks.getToken.mockResolvedValue("test-token");

      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
         })
      );

      mocks.supabaseBrowser.channel.mockReturnValue(mocks.channel);
      mocks.channel.on.mockReturnValue(mocks.channel);
      mocks.channel.subscribe.mockReturnValue(mocks.channel);

      renderHook(() => useActivity("board-1"));

      await waitFor(() => {
         expect(mocks.channel.on).toHaveBeenCalled();
      });

      const callback = mocks.channel.on.mock.calls[0][2];

      callback({
         eventType: "INSERT",
         new: {
            id: "activity-2",
            board_id: "board-1",
            actor_id: "user-2",
            action: "task.updated",
            entity_type: "task",
            entity_id: "task-2",
            metadata: {},
            created_at: "2026-09-25",
         },
      });

      expect(mocks.dispatch).toHaveBeenCalledWith({
         type: "ADD_ACTIVITY",
         payload: {
            activity: {
               id: "activity-2",
               board_id: "board-1",
               actor_id: "user-2",
               action: "task.updated",
               entity_type: "task",
               entity_id: "task-2",
               metadata: {},
               created_at: "2026-09-25",
               createdAt: "2026-09-25",
               boardId: "board-1",
               actorId: "user-2",
               entityType: "task",
               entityId: "task-2",
            },
         },
      });
   });

   it("removes the activity channel when the hook unmounts", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useActivity } = await import("./useActivity");

      mocks.getToken.mockResolvedValue("test-token");

      vi.stubGlobal(
         "fetch",
         vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
         })
      );

      mocks.supabaseBrowser.channel.mockReturnValue(mocks.channel);
      mocks.channel.on.mockReturnValue(mocks.channel);
      mocks.channel.subscribe.mockReturnValue(mocks.channel);

      const { unmount } = renderHook(() =>
         useActivity("board-1")
      );

      await waitFor(() => {
         expect(
            mocks.supabaseBrowser.channel
         ).toHaveBeenCalledWith("activity-board-1");
      });

      unmount();

      expect(
         mocks.supabaseBrowser.removeChannel
      ).toHaveBeenCalledWith(mocks.channel);
   });
});