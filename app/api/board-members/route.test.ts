import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   createSupabaseServerClient: vi.fn(),

   from: vi.fn(),
   select: vi.fn(),
}));

vi.mock("@/app/shared/services/supabase", () => ({
   createSupabaseServerClient:
      mocks.createSupabaseServerClient,
}));

describe("API /api/board-members", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         select: mocks.select,
      });
   });

   it("returns board members successfully", async () => {
      const { GET } = await import("./route");

      const members = [
         {
            id: "member-1",
            board_id: "board-1",
            user_id: "user-1",
            role: "owner",
         },
         {
            id: "member-2",
            board_id: "board-1",
            user_id: "user-2",
            role: "editor",
         },
      ];

      mocks.select.mockResolvedValue({
         data: members,
         error: null,
      });

      const response = await GET();

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(members);

      expect(mocks.from).toHaveBeenCalledWith("board_members");
      expect(mocks.select).toHaveBeenCalledWith("*");
   });

   it("returns 500 when loading board members fails", async () => {
      const { GET } = await import("./route");

      mocks.select.mockResolvedValue({
         data: null,
         error: {
            message: "Failed to load board members",
         },
      });

      const response = await GET();

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Failed to load board members",
      });
   });
});