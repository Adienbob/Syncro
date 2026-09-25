import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   useAuth: vi.fn(),
   useUser: vi.fn(),
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

describe("Test useNotificationRealtime", () => {
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

   it("does not subscribe when the user is not signed in", async () => {
      const { renderHook } = await import(
         "@testing-library/react"
      );

      const { useNotificationRealtime } = await import(
         "./useNotificationRealtime"
      );

      mocks.useAuth.mockReturnValue({
         getToken: vi.fn(),
      });

      mocks.useUser.mockReturnValue({
         user: null,
         isSignedIn: false,
      });

      renderHook(() => useNotificationRealtime());

      expect(
         mocks.supabaseBrowser.channel
      ).not.toHaveBeenCalled();
   });

   it("subscribes to notifications when the user is signed in", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useNotificationRealtime } = await import(
         "./useNotificationRealtime"
      );

      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      mocks.useAuth.mockReturnValue({
         getToken: mockGetToken,
      });

      mocks.useUser.mockReturnValue({
         user: { id: "demo-hussien" },
         isSignedIn: true,
      });

      renderHook(() => useNotificationRealtime());

      await waitFor(() => {
         expect(mockGetToken).toHaveBeenCalledWith({
            template: "supabase",
         });
      });

      expect(
         mocks.supabaseBrowser.realtime.setAuth
      ).toHaveBeenCalledWith("test-token");

      expect(
         mocks.supabaseBrowser.channel
      ).toHaveBeenCalledWith("notifications");

      expect(
         mocks.channel.subscribe
      ).toHaveBeenCalled();
   });

   it("dispatches ADD_NOTIFICATION when a new notification is inserted", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useNotificationRealtime } = await import(
         "./useNotificationRealtime"
      );

      const mockGetToken = vi.fn().mockResolvedValue("test-token");

      mocks.useAuth.mockReturnValue({
         getToken: mockGetToken,
      });

      mocks.useUser.mockReturnValue({
         user: { id: "demo-hussien" },
         isSignedIn: true,
      });

      renderHook(() => useNotificationRealtime());

      await waitFor(() => {
         expect(mocks.channel.on).toHaveBeenCalled();
      });

      const callback = mocks.channel.on.mock.calls[0][2];

      callback({
         eventType: "INSERT",
         new: {
            id: "notification-1",
            user_id: "demo-hussien",
            board_id: "board-1",
            type: "task_assigned",
            metadata: {
               taskId: "task-1",
            },
            is_read: false,
            created_at: "2026-09-25",
         },
      });

      expect(mocks.dispatch).toHaveBeenCalledWith({
         type: "ADD_NOTIFICATION",
         payload: {
            notification: {
               id: "notification-1",
               userId: "demo-hussien",
               boardId: "board-1",
               type: "task_assigned",
               metadata: {
                  taskId: "task-1",
               },
               isRead: false,
               createdAt: "2026-09-25",
            },
         },
      });
   });

   it("removes the notification channel when the hook unmounts", async () => {
      const { renderHook, waitFor } = await import(
         "@testing-library/react"
      );

      const { useNotificationRealtime } = await import(
         "./useNotificationRealtime"
      );

      mocks.useAuth.mockReturnValue({
         getToken: vi.fn().mockResolvedValue("test-token"),
      });

      mocks.useUser.mockReturnValue({
         user: { id: "demo-hussien" },
         isSignedIn: true,
      });

      const { unmount } = renderHook(() =>
         useNotificationRealtime()
      );

      await waitFor(() => {
         expect(
            mocks.supabaseBrowser.channel
         ).toHaveBeenCalledWith("notifications");
      });

      unmount();

      expect(
         mocks.supabaseBrowser.removeChannel
      ).toHaveBeenCalledWith(mocks.channel);
   });
});