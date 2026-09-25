import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   createSupabaseServerClient: vi.fn(),
   from: vi.fn(),
   update: vi.fn(),
   eq: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
   currentUser: mocks.currentUser,
}));

vi.mock("@/app/shared/services/supabase", () => ({
   createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

describe("API /api/notifications/read-all", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         update: mocks.update,
      });

      mocks.update.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.eq.mockReturnValue({
         eq: mocks.eq,
      });
   });

   it("returns 401 when the user is not authenticated", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue(null);

      const response = await PATCH();

      expect(response.status).toBe(401);

      expect(await response.json()).toEqual({
         error: "Unauthorized",
      });

      expect(mocks.createSupabaseServerClient).not.toHaveBeenCalled();
   });

   it("marks all unread notifications as read", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.eq.mockReturnValueOnce({
         eq: mocks.eq,
      });

      mocks.eq.mockResolvedValueOnce({
         error: null,
      });

      const response = await PATCH();

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         success: true,
      });

      expect(mocks.from).toHaveBeenCalledWith("notifications");
      expect(mocks.update).toHaveBeenCalledWith({
         is_read: true,
      });

      expect(mocks.eq).toHaveBeenNthCalledWith(
         1,
         "user_id",
         "user-1"
      );

      expect(mocks.eq).toHaveBeenNthCalledWith(
         2,
         "is_read",
         false
      );
   });

   it("returns 500 when marking notifications as read fails", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.eq.mockReturnValueOnce({
         eq: mocks.eq,
      });

      mocks.eq.mockResolvedValueOnce({
         error: {
            message: "Failed to update notifications",
         },
      });

      const response = await PATCH();

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Failed to update notifications",
      });
   });
});