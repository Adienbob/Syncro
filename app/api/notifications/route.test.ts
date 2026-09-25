import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   createSupabaseServerClient: vi.fn(),
   from: vi.fn(),
   select: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
   currentUser: mocks.currentUser,
}));

vi.mock("@/app/shared/services/supabase", () => ({
   createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

describe("API /api/notifications", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
      });
   });

   it("returns 401 when the user is not authenticated", async () => {
      const { GET } = await import("./route");

      mocks.currentUser.mockResolvedValue(null);

      const response = await GET();

      expect(response.status).toBe(401);

      expect(await response.json()).toEqual({
         error: "Unauthorized",
      });

      expect(mocks.from).not.toHaveBeenCalled();
   });

   it("returns notifications successfully", async () => {
      const { GET } = await import("./route");

      const notifications = [
         {
            id: "notification-1",
            user_id: "user-1",
            type: "member.role_changed",
            read: false,
         },
      ];

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.select.mockResolvedValue({
         data: notifications,
         error: null,
      });

      const response = await GET();

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual(notifications);

      expect(mocks.from).toHaveBeenCalledWith("notifications");
      expect(mocks.select).toHaveBeenCalledWith("*");
   });

   it("returns 500 when loading notifications fails", async () => {
      const { GET } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.select.mockResolvedValue({
         data: null,
         error: {
            message: "Failed to load notifications",
         },
      });

      const response = await GET();

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Failed to load notifications",
      });
   });
});