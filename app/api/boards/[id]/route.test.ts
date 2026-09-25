import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
   currentUser: vi.fn(),
   createSupabaseServerClient: vi.fn(),
   createActivity: vi.fn(),

   from: vi.fn(),
   update: vi.fn(),
   delete: vi.fn(),
   eq: vi.fn(),
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
      BOARD_RENAMED: "board.renamed",
   },
}));

describe("API /api/boards/[id]", () => {
   beforeEach(() => {
      vi.clearAllMocks();

      mocks.createSupabaseServerClient.mockResolvedValue({
         from: mocks.from,
      });

      mocks.from.mockReturnValue({
         update: mocks.update,
         delete: mocks.delete,
      });

      mocks.update.mockReturnValue({
         eq: mocks.eq,
      });

      mocks.delete.mockReturnValue({
         eq: mocks.eq,
      });
   });

   it("returns 401 when the user is not authenticated", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue(null);

      const req = new Request(
         "http://localhost/api/boards/board-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               title: "New Title",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            id: "board-1",
         }),
      });

      expect(response.status).toBe(401);

      expect(await response.json()).toEqual({
         error: "Unauthorized",
      });

      expect(mocks.from).not.toHaveBeenCalled();
   });

   it("renames the board successfully", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
      });

      mocks.eq.mockResolvedValue({
         error: null,
      });

      const req = new Request(
         "http://localhost/api/boards/board-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               title: "New Title",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            id: "board-1",
         }),
      });

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         success: true,
      });

      expect(mocks.from).toHaveBeenCalledWith("boards");
      expect(mocks.update).toHaveBeenCalledWith({
         title: "New Title",
      });
      expect(mocks.eq).toHaveBeenCalledWith("id", "board-1");

      expect(mocks.createActivity).toHaveBeenCalled();
   });

   it("returns 500 when updating the board fails", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
      });

      mocks.eq.mockResolvedValue({
         error: {
            message: "Database error",
         },
      });

      const req = new Request(
         "http://localhost/api/boards/board-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               title: "New Title",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            id: "board-1",
         }),
      });

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Database error",
      });

      expect(mocks.createActivity).not.toHaveBeenCalled();
   });

   it("returns success when activity creation fails", async () => {
      const { PATCH } = await import("./route");

      mocks.currentUser.mockResolvedValue({
         id: "user-1",
         fullName: "Hussien",
         username: "hussien",
      });

      mocks.eq.mockResolvedValue({
         error: null,
      });

      mocks.createActivity.mockRejectedValue(
         new Error("Activity log failed")
      );

      const req = new Request(
         "http://localhost/api/boards/board-1",
         {
            method: "PATCH",
            body: JSON.stringify({
               title: "New Title",
            }),
         }
      );

      const response = await PATCH(req, {
         params: Promise.resolve({
            id: "board-1",
         }),
      });

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         success: true,
      });

      expect(mocks.update).toHaveBeenCalledWith({
         title: "New Title",
      });

      expect(mocks.createActivity).toHaveBeenCalled();
   });

   it("deletes the board successfully", async () => {
      const { DELETE } = await import("./route");

      mocks.eq.mockResolvedValue({
         error: null,
      });

      const req = new Request(
         "http://localhost/api/boards/board-1",
         {
            method: "DELETE",
         }
      );

      const response = await DELETE(req, {
         params: Promise.resolve({
            id: "board-1",
         }),
      });

      expect(response.status).toBe(200);

      expect(await response.json()).toEqual({
         success: true,
      });

      expect(mocks.from).toHaveBeenCalledWith("boards");
      expect(mocks.delete).toHaveBeenCalled();
      expect(mocks.eq).toHaveBeenCalledWith("id", "board-1");
   });

   it("returns 500 when deleting the board fails", async () => {
      const { DELETE } = await import("./route");

      mocks.eq.mockResolvedValue({
         error: {
            message: "Failed to delete board",
         },
      });

      const req = new Request(
         "http://localhost/api/boards/board-1",
         {
            method: "DELETE",
         }
      );

      const response = await DELETE(req, {
         params: Promise.resolve({
            id: "board-1",
         }),
      });

      expect(response.status).toBe(500);

      expect(await response.json()).toEqual({
         error: "Failed to delete board",
      });

      expect(mocks.from).toHaveBeenCalledWith("boards");
      expect(mocks.delete).toHaveBeenCalled();
      expect(mocks.eq).toHaveBeenCalledWith("id", "board-1");
   });
});