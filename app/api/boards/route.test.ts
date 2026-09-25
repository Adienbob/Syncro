import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   createSupabaseServerClient: vi.fn(),
   createActivity: vi.fn(),

   rpc: vi.fn(),
   from: vi.fn(),
   select: vi.fn(),
   eq: vi.fn(),
   single: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
   currentUser: mocks.currentUser,
}));

vi.mock("@/app/shared/services/supabase", () => ({
   createSupabaseServerClient:
      mocks.createSupabaseServerClient,
}));

vi.mock(
   "@/app/features/activity/utils/createActivity",
   () => ({
      createActivity: mocks.createActivity,
   })
);

vi.mock("@/app/features/activity/constants", () => ({
   ActivityActions: {
      BOARD_CREATED: "board.created",
   },
}));

describe("POST /api/boards", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         rpc: mocks.rpc,
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
      });

      mocks.select.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.eq.mockReturnValue({
         eq: mocks.eq,
         single: mocks.single,
      });
   });

   it("returns 401 when the user is not authenticated", async () => {
      const { POST } = await import("./route");

      mocks.currentUser.mockResolvedValue(null);

      const req = new Request("http://localhost/api/boards", {
         method: "POST",
         body: JSON.stringify({
            title: "Test Board",
         }),
      });

      const response = await POST(req);

      expect(response.status).toBe(401);

      expect(await response.json()).toEqual({
         error: "Unauthorized",
      });

      expect(
         mocks.createSupabaseServerClient
      ).not.toHaveBeenCalled();
   });

   it("creates a board successfully", async () => {
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
         imageUrl: "https://example.com/avatar.png",
      };

      const board = {
         id: "board-1",
         title: "My Board",
      };

      const member = {
         id: "member-1",
         board_id: "board-1",
         user_id: "user-1",
         role: "owner",
      };

      mocks.currentUser.mockResolvedValue(user);

      mocks.rpc.mockResolvedValue({
         data: board,
         error: null,
      });

      mocks.single.mockResolvedValue({
         data: member,
         error: null,
      });

      mocks.createActivity.mockResolvedValue(undefined);

      const req = new Request("http://localhost/api/boards", {
         method: "POST",
         body: JSON.stringify({
            title: "My Board",
         }),
      });

      const response = await POST(req);

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         board,
         member,
      });

      expect(mocks.rpc).toHaveBeenCalledWith(
         "create_board",
         {
            p_title: "My Board",
            p_display_name: "Hussien Walid",
            p_email: "hussien@example.com",
            p_image_url: "https://example.com/avatar.png",
         }
      );

      expect(mocks.createActivity).toHaveBeenCalled();
   });

   it("returns 500 when creating the board fails", async () => {
      const { POST } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien Walid",
         username: "hussien",
         emailAddresses: [
            {
               emailAddress: "hussien@example.com",
            },
         ],
         imageUrl: "https://example.com/avatar.png",
      });

      mocks.rpc.mockResolvedValue({
         data: null,
         error: new Error("Failed to create board"),
      });

      const req = new Request("http://localhost/api/boards", {
         method: "POST",
         body: JSON.stringify({
            title: "My Board",
         }),
      });

      const response = await POST(req);

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Server crashed",
      });

      expect(mocks.createActivity).not.toHaveBeenCalled();
   });

   it("still returns the created board when activity creation fails", async () => {
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
         imageUrl: "https://example.com/avatar.png",
      };

      const board = {
         id: "board-1",
         title: "My Board",
      };

      const member = {
         id: "member-1",
         board_id: "board-1",
         user_id: "user-1",
         role: "owner",
      };

      mocks.currentUser.mockResolvedValue(user);

      mocks.rpc.mockResolvedValue({
         data: board,
         error: null,
      });

      mocks.single.mockResolvedValue({
         data: member,
         error: null,
      });

      mocks.createActivity.mockRejectedValue(
         new Error("Activity failed")
      );

      const req = new Request("http://localhost/api/boards", {
         method: "POST",
         body: JSON.stringify({
            title: "My Board",
         }),
      });

      const response = await POST(req);

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         board,
         member,
      });

      expect(mocks.createActivity).toHaveBeenCalled();
   });

   it("returns boards for the authenticated user", async () => {
      const { GET } = await import("./route");

      const user = {
         id: "user-1",
      };

      const boardRows = [
         {
            boards: {
               id: "board-1",
               title: "My Board",
            },
         },
         {
            boards: {
               id: "board-2",
               title: "Another Board",
            },
         },
      ];

      mocks.currentUser.mockResolvedValue(user);

      mocks.from.mockReturnValue({
         select: mocks.select,
      });

      mocks.select.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.eq.mockResolvedValue({
         data: boardRows,
         error: null,
      });

      const response = await GET();

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual([
         {
            id: "board-1",
            title: "My Board",
         },
         {
            id: "board-2",
            title: "Another Board",
         },
      ]);

      expect(mocks.from).toHaveBeenCalledWith(
         "board_members"
      );

      expect(mocks.select).toHaveBeenCalledWith(
   expect.stringContaining("boards")
);

      expect(mocks.eq).toHaveBeenCalledWith(
         "user_id",
         "user-1"
      );
   });

   it("returns 500 when loading user boards fails", async () => {
      const { GET } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
      });

      mocks.select.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.eq.mockResolvedValue({
         data: null,
         error: {
            message: "Database error",
         },
      });

      const response = await GET();

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Database error",
      });
   });
});